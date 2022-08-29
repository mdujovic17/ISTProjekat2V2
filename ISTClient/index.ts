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

/*GET Methods*/

app.get('/', (req: Request, res: Response) => {
    res.send(getView("index"));
})

//Stranicenje preduzeca
app.get('/preduzeca/:pageNumber?/:pageSize?', async (req: Request, res: Response) => {
    
    if (!req.query.pageNumber && !req.query.pageSize) {
        (req.query.pageNumber as unknown as Number) = 1;
        (req.query.pageSize as unknown as Number) = 10;
    }
    
    let options = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/get?PageNumber=${req.query["pageNumber"]}&PageSize=${req.query["pageSize"]}`,
        httpsAgent: agent
    }

    //console.log(options.url);
    //console.log(req.query);

    axios.request(options).then((response) => {
        //console.log(response.data)
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
                
                    <td><a class="text-info" href="/detailsPreduzece/${element.id}"><i class="fa fa-circle-info"></i></a></td>
                    <td><a class="text-warning" href="/editPreduzece/${element.id}"><i class="fa fa-pen"></i></a></td>
                    <td><a class="text-danger" href="/deletePreduzece/${element.id}"><i class="fa fa-trash"></i></a></td>
                </tr>`;
            });
            res.send(getView("preduzeca").replace("##TABLEDATA", view));
        };
    }).catch(function (error) {
        console.error(error);
    });
});

//Pretraga preduzeca sa stranicenjem
app.get('/searchPreduzeca/:query?/:pageNumber?/:pageSize?', async (req: Request, res: Response) => {
    
    if (!req.query.pageNumber && !req.query.pageSize) {
        (req.query.pageNumber as unknown as Number) = 1;
        (req.query.pageSize as unknown as Number) = 10;
    }
    
    let options = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/search?query=${req.query["query"]}&PageNumber=${req.query["pageNumber"]}&PageSize=${req.query["pageSize"]}`,
        httpsAgent: agent
    }

    console.log(options.url);
    console.log(req.query);

    axios.request(options).then((response) => {
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
                
                    <td><a class="text-info" href="/detailsPreduzece/${element.id}"><i class="fa fa-circle-info"></i></a></td>
                    <td><a class="text-warning" href="/editPreduzece/${element.id}"><i class="fa fa-pen"></i></a></td>
                    <td><a class="text-danger" href="/deletePreduzece/${element.id}"><i class="fa fa-trash"></i></a></td>
                </tr>`;
            });
            res.send(getView("preduzeca").replace("##TABLEDATA", view));
        };
    }).catch(function (error) {
        console.error(error);
    });
});

//Stranicenje stavki
app.get('/stavke/:pageNumber?/:pageSize?', async (req: Request, res: Response) => {
    
    if (!req.query.pageNumber && !req.query.pageSize) {
        (req.query.pageNumber as unknown as Number) = 1;
        (req.query.pageSize as unknown as Number) = 10;
    }
    
    let options = {
        method: "GET",
        url: `http://localhost:${port}/api/Stavka/get?PageNumber=${req.query["pageNumber"]}&PageSize=${req.query["pageSize"]}`,
        httpsAgent: agent
    }

    //console.log(options.url);
    //console.log(req.query);

    axios.request(options).then((response) => {
        //console.log(response.data)
        let view = ``;
        if (response.data != null) {
            response.data.data.forEach((element: Stavka) => {
                view += 
                `<tr>
                    <th scope="row">${element.id}</th>
                    <td>${element.name}</td>
                    <td>${element.pricePerUnit}</td>
                    <td>${element.unitOfMeasurement}</td>
                    <td colspan="2">${element.amount}</td>
                
                    <td><a class="text-warning" href="/editStavka/${element.id}"><i class="fa fa-pen"></i></a></td>
                    <td><a class="text-danger" href="/deleteStavka/${element.id}"><i class="fa fa-trash"></i></a></td>
                </tr>`;
            });
            res.send(getView("stavke").replace("##TABLEDATA", view));
        };
    }).catch(function (error) {
        console.error(error);
    });
});

// DODAVANJE
app.get("/addPreduzece", async (request: Request, response: Response) => {
    response.send(getView("add/preduzece"));
});

app.get("/addStavka", async (request: Request, response: Response) => {
    let view = getView("add/stavka");
    response.send(view);
});

app.get("/addFaktura", async (request: Request, response: Response) => {

    let optionsPreduzeca = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/get/all`,
        httpsAgent: agent

    }

    let optionsStavke = {
        method: "GET",
        url: `http://localhost:${port}/api/Stavka/get/all`,
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

    //console.log(preduzeca);
    //console.log(stavke);

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

//BILANS
app.get("/bilans", async (request: Request, response: Response) => {
    let view = getView("bilans");
    let optionsPreduzeca = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/get/all`,
        httpsAgent: agent
    };

    let preduzeca: Array<Preduzece> = new Array<Preduzece>();

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

    await delay(500);

    let preduzecaStr = ``;
    preduzeca.forEach(p => {
        preduzecaStr += `<option value="${p.id}">${p.companyName} ${p.vat}</option>`
    });

    view = view.replaceAll("##COMPANIES", preduzecaStr);

    response.send(view);
});

app.get("/bilansGet", async (request: Request, response: Response) => {
    let view = getView("bilansSum");
    let optionsPreduzeca = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/get/${request.query["company"]}`,
        httpsAgent: agent
    };
    let optionsBilans = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/bilans/${request.query["company"]}`,
        httpsAgent: agent
    };

    let preduzeceStr = ``;

    axios.request(optionsPreduzeca).then(async (res) => {
        console.log(res.data.data)
        preduzeceStr += 
        `
        <tr>
            <td>PIB</td>
            <td>${res.data.data.vat}</td>
        </tr>
        `;

        view = view.replaceAll("##NAME", res.data.data.companyName);
    }).catch(err => {
        console.log(err);
    });

    axios.request(optionsBilans).then(async (res) => {
        console.log(res.data.data)
        preduzeceStr += `
        
        <tr>
            <td>Broj ulaznih faktura</td>
            <td>${res.data.data.In}</td>
        </tr>
        <tr>
            <td>Broj izlaznih faktura</td>
            <td>${res.data.data.Out}</td>
        </tr>
        <tr>
            <td>Suma ulaznih faktura</td>
            <td class="text-success">${res.data.data.sumIn}</td>
        </tr>
        <tr>
            <td>Broj izlaznih faktura</td>
            <td class="text-danger">${res.data.data.sumOut}</td>
        </tr>
        <tr>
            <td>Bilans</td>
            <td class="text-warning">${res.data.data.bilans}</td>
        </tr>
        `
    })

    await delay(500);

    view = view.replaceAll("##TABLEDATA", preduzeceStr);

    response.send(view);
});

//DETALJI
app.get("/detailsPreduzece/:id", async (request: Request, response: Response) => {

    let view = getView("details/details");

    let options = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/get/${request.params["id"]}`,
        httpsAgent: agent
    };

    console.log(request.query)
    console.log(request.params)

    let detailsStr = ``;

    axios.request(options).then((res) => {
        console.log(res.data.data)

        detailsStr = `
        <tr><td>Ime i prezime</td><td>${res.data.data.name} ${res.data.data.lastName}</td></tr>
        <tr><td>Telefon</td><td>${res.data.data.phoneNumber}</td></tr>
        <tr><td>Adresa</td><td>${res.data.data.companyAddress}</td></tr>
        <tr><td>Naziv preduzeca</td><td>${res.data.data.companyName}</td></tr>
        <tr><td>PIB</td><td>${res.data.data.vat}</td></tr>
        `;

        view = view
        .replaceAll("##NAME", res.data.data.companyName)
        .replaceAll("##EDIT", `/editPreduzece/${res.data.data.id}`)
        .replaceAll("##DELETE", `/deletePreduzece/${res.data.data.id}`);
    }).catch(err => {
        console.log(err);
    });

    await delay(500);

    view = view.replaceAll("##TABLEDATA", detailsStr);

    response.send(view);
});

app.get("detailsStavka", async (request: Request, response: Response) => {
    let view = getView("details/details");

    let options = {
        method: "GET",
        url: `http://localhost:${port}/api/Stavka/get/${request.params["id"]}`,
        httpsAgent: agent
    };

    console.log(request.query)
    console.log(request.params)

    let detailsStr = ``;

    axios.request(options).then((res) => {
        console.log(res.data.data)

        detailsStr = `
        <tr><td>Naziv</td><td>${res.data.data.name} ${res.data.data.name}</td></tr>
        <tr><td>Cena po jedinici mere</td><td>${res.data.data.pricePerUnit}</td></tr>
        <tr><td>Jedinica mere</td><td>${res.data.data.unitOfMeasurement}</td></tr>
        <tr><td>Kolicina</td><td>${res.data.data.amount}</td></tr>
        `;

        view = view
        .replaceAll("##NAME", res.data.data.name)
        .replaceAll("##EDIT", `/editStavka/${res.data.data.id}`)
        .replaceAll("##DELETE", `/deleteStavka/${res.data.data.id}`);
    }).catch(err => {
        console.log(err);
    });

    await delay(500);

    view = view.replaceAll("##TABLEDATA", detailsStr);

    response.send(view);
});

/*POST Methods*/
//DODAVANJE
app.post("/addPreduzece", (request: Request, response: Response) => {
    let options = {
        method: "POST",
        url: `http://localhost:${port}/api/Preduzece/add`,
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

app.post("/addStavka", (request: Request, response: Response) => {
    let options = {
        method: "POST",
        url: `http://localhost:${port}/api/Stavka/add`,
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

app.post("/addFaktura", async (request: Request, response: Response) => {
    let optionsPreduzeca = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/get/all`,
        httpsAgent: agent

    }

    // let optionsStavke = {
    //     method: "GET",
    //     url: `http://localhost:${port}/api/Stavka/get/all`,
    //     httpsAgent: agent

    // }

    let preduzeca: Array<Preduzece> = new Array<Preduzece>();

    //let stavke: Array<Stavka> = new Array<Stavka>();

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

    // axios.request(optionsStavke).then(async (res) => {
    //     console.log(res.data.data)
    //     for (let i = 0; i < res.data.data.length; i++) {
    //         stavke.push({
    //             id: res.data.data[i].id,
    //             name: res.data.data[i].name,
    //             pricePerUnit: res.data.data[i].pricePerUnit,
    //             unitOfMeasurement: res.data.data[i].unitOfMeasurement,
    //             amount: res.data.data[i].amount
    //         });
    //     }
    // }).catch(err => {
    //     console.log(err);
    // });

    await delay(500);

    // console.log(preduzeca);
    // console.log(stavke);

    let destinationCompany = preduzeca.find(p => p.id === parseInt(request.body.destinationCompanyVAT));
    let originCompany = preduzeca.find(p => p.id === parseInt(request.body.originCompanyVAT));

    let stavke2: Array<Number> = new Array<Number>();

    //console.log(destinationCompany);
    //console.log(originCompany);

    //console.log(request.body);

    //let prvaStavka = stavke.find(s => s.id === parseInt(request.body.item));

    stavke2.push(parseInt(request.body.item));

    for (let i = 0; i < request.body.counter; i++) {
        //let stavka = stavke.find(s => s.id === parseInt(request.body[`item-${i}`])) as Stavka;
        stavke2.push(parseInt(request.body[`item-${i}`]));
    }

    let deadline = new Date(Date.parse(request.body.paymentDeadline));

    let type: Boolean = request.body.type === "in";

    let options = {
        method: "POST",
        url: `http://localhost:${port}/api/Faktura/add`,
        httpsAgent: agent,
        data: {
            id: 0,
            destinationCompanyVAT: destinationCompany?.vat,
            originCompanyVAT: originCompany?.vat,
            dateOfCreating: today,
            paymentDeadline: deadline,
            items: stavke2,
            type: type
        }
    };

    //console.log(stavke2);
    //console.log(options.data);

    axios.request(options).then((res) => {
        console.log(res.data);
    }).catch(err => {
        console.log(err);
    });

    response.redirect("/preduzeca?pageNumber=1&pageSize=10");
})

/*PUT Methods*/
//IZMENE
app.put("/editPreduzece/:id", async (request: Request, response: Response) => {
    let view = getView("edit/preduzece");

    response.send(view);
});

app.put("/editStavka/:id", async (request: Request, response: Response) => {
    let view = getView("edit/stavka");

    response.send(view);
});

app.put("/editFaktura/:id", async (request: Request, response: Response) => {
    let view = getView("edit/faktura");

    response.send(view);
});

/*DELETE Methods*/
//BRISANJE
app.get("/deletePreduzece/:id", (request: Request, response: Response) => {
    axios.delete(`http://localhost:${port}/api/Preduzece/delete/${request.params["id"]}`);

    response.redirect("/preduzeca?pageNumber=1&pageSize=10");
});

app.get("/deleteStavka/:id", (request: Request, response: Response) => {
    axios.delete(`http://localhost:${port}/api/Stavka/delete/${request.params["id"]}`);

    response.redirect("/stavke?pageNumber=1&pageSize=10");
});

app.get("/deleteFaktura/:id", (request: Request, response: Response) => {
    axios.delete(`http://localhost:${port}/api/Faktura/delete/${request.params["id"]}`);

    response.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    response.redirect("back");
});

app.listen(client_port, () => { console.log(`Client started on port ${client_port}`); });