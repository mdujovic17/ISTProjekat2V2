import express, { Express, Request, Response } from 'express';
import axios from 'axios';
import { readFileSync } from 'fs';
import path from 'path';
import https from 'https'

const agent = new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true
})

const app: Express = express();
app.use(express.urlencoded({extended: false}))
app.use(express.json());

const port: Number = 5077;
const client_port: Number = 3001;

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

app.listen(client_port, () => { console.log(`Client started on port ${client_port}`); });