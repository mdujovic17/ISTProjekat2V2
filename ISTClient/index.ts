import express, { Express, Request, response, Response } from 'express';
import axios from 'axios';
import { readFileSync } from 'fs';
import path from 'path';
import https from 'https'
import { request } from 'http';

const agent = new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true
})

const app: Express = express();
app.use(express.urlencoded({extended: false}))
app.use(express.json());

const port: Number = 5077;
const client_port: Number = 3001;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

interface Preduzece {
    id: number;
    name: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    companyName: string;
    companyAddress: string;
    vat: string;
}

interface Faktura {
    id: number;
    vat: string;
    vatOfOrigin: string;
    dateGenerated: string;
    dateDeadline: string;
    items: Stavka[];
    total: number;
    type: boolean;
}

interface Stavka {
    id: number;
    name: string;
    pricePerUnit: number;
    unitOfMeasurement: string;
    amount: number;
}

let getView = (view: String) => {
    return readFileSync(path.join(`${__dirname}/view/${view}.html`), "utf-8");
}

app.get('/', (req: Request, res: Response) => {
    res.send(getView("index"));
})

app.get('/preduzeca/:pageNumber?/:pageSize?', (req: Request, res: Response) => {
    
    if (!req.query.pageNumber && !req.query.pageSize) {
        (req.query.pageNumber as unknown as Number) = 1;
        (req.query.pageSize as unknown as Number) = 10;
    }
    
    let options = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/get/preduzece?PageNumber=${req.query["pageNumber"]}&PageSize=${req.query["pageSize"]}`,
        httpsAgent: agent
    }

    console.log(options.url);
    console.log(req.query);

    axios.request(options).then((response) => {
        console.log(response.data)
        let view = ``;
        if (response.data != null) {
            response.data.data.forEach((element: Preduzece) => {
                view += 
                `<tr>
                    <th scope="row">${element.id}</th>
                    <td>${element.name} ${element.lastName}</td>
                    <td>${element.email}</td>
                    <td>${element.companyName}</td>
                    <td colspan="2">${element.vat}</td>
                
                    <td><a class="text-info" href="/details/${element.id}"><i class="fa fa-circle-info"></i></a></td>
                    <td><a class="text-warning" href="/edit/${element.id}"><i class="fa fa-pen"></i></a></td>
                    <td><a class="text-danger" href="/delete/${element.id}"><i class="fa fa-trash"></i></a></td>
                </tr>`;
            });
            res.send(getView("preduzeca").replace("##TABLEDATA", view));
        };
    }).catch(function (error) {
        console.error(error);
    });
});

app.get("/addPreduzece", (request: Request, response: Response) => {
    response.send(getView("add/preduzece"));
});

app.post("/addPreduzece", (request: Request, response: Response) => {
    let options = {
        method: "POST",
        url: `http://localhost:${port}/api/Preduzece/add/preduzece`,
        httpsAgent: agent,
        data: {
            id: 0,
            name: request.body.name,
            lastName: request.body.lastName,
            phoneNumber: request.body.phone,
            email: request.body.email,
            companyAddress: request.body.companyAddress,
            companyName: request.body.companyName,
            vat: request.body.vat
        }
    };

    axios.request(options).then(response => {
        console.log(response.data);
    }).catch(err => {
        console.log(err);
    });

    response.redirect("/preduzeca?pageNumber=1&pageSize=10");
});

app.get("/addStavka", (request: Request, response: Response) => {
    let view = getView("add/stavka");
    response.send(view);
});

app.post("/addStavka", (request: Request, response: Response) => {
    let options = {
        method: "POST",
        url: `http://localhost:${port}/api/Stavka/add/stavka`,
        httpsAgent: agent,
        data: {
            id: 0,
            name: request.body.name,
            pricePerUnit: request.body.pricePerUnit,
            unitOfMeasurement: request.body.unitOfMeasurement,
            amount: request.body.amount
        }
    };

    axios.request(options).then(res => {
        console.log(res.data);
    }).catch(err => {
        console.log(err);
    });
});

app.get("/addFaktura", async (request: Request, response: Response) => {

    let optionsPreduzeca = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/get/preduzece/all`,
        httpsAgent: agent

    }

    let optionsStavke = {
        method: "GET",
        url: `http://localhost:${port}/api/Stavka/get/stavka/all`,
        httpsAgent: agent

    }

    let preduzeca: Array<Preduzece> = new Array<Preduzece>();
    let stavke: Array<Stavka> = new Array<Stavka>();
    let today = new Date();

    axios.request(optionsPreduzeca).then(async (res) => {
        console.log(res.data.data)
        for (let i = 0; i < res.data.data.length; i++) {
            preduzeca.push({
                id: res.data.data[i].id,
                name: res.data.data[i].name,
                lastName: res.data.data[i].lastName,
                phoneNumber: res.data.data[i].phoneNumber,
                email: res.data.data[i].email,
                companyAddress: res.data.data[i].companyAddress,
                companyName: res.data.data[i].companyName,
                vat: res.data.data[i].vat
            });
        }
    }).catch(err => {
        console.log(err);
    });

    axios.request(optionsStavke).then(async (res) => {
        console.log(res.data.data)
        for (let i = 0; i < res.data.data.length; i++) {
            stavke.push({
                id: res.data.data[i].id,
                name: res.data.data[i].name,
                pricePerUnit: res.data.data[i].pricePerUnit,
                unitOfMeasurement: res.data.data[i].unitOfMeasurement,
                amount: res.data.data[i].amount
            });
        }
    }).catch(err => {
        console.log(err);
    });

    await delay(500);

    console.log(preduzeca);
    console.log(stavke);

    let view = getView("add/faktura");

    let preduzecaStr = ``;
    let stavkeStr = ``;
    preduzeca.forEach(p => {
        preduzecaStr += `<option value="${p.id}">${p.companyName} ${p.vat}</option>`
    });

    stavke.forEach(s => {
        stavkeStr += `<option value="${s.id}">${s.name} (${s.pricePerUnit} po ${s.unitOfMeasurement})</option>`;
    });

    view = view.replaceAll("##COMPANIES", preduzecaStr).replaceAll("##ITEMS", stavkeStr);

    response.send(view);
});

app.get("/editPreduzece/:id", (request: Request, response: Response) => {
    let view = getView("edit/preduzece");

    response.send(view);
});

app.get("/editStavka/:id", (request: Request, response: Response) => {
    let view = getView("edit/stavka");

    response.send(view);
});

app.get("/editFaktura/:id", (request: Request, response: Response) => {
    let view = getView("edit/faktura");

    response.send(view);
});

app.listen(client_port, () => { console.log(`Client started on port ${client_port}`); });