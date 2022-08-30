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
    items: number[];
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

            let pages = ``;
            let previous = ``;
            let next = ``;

            for (let i = 0; i < response.data.totalPages; i++) {
                pages += `<li class="page-item"><a class="page-link ${response.data.pageNumber === i + 1 ? "active" : ""}" href="/preduzeca?pageNumber=${i + 1}&pageSize=${response.data.pageSize}">${i + 1}</a></li>`;
            }

            previous = `/preduzeca?pageNumber=${response.data.pageNumber - 1}&pageSize=${response.data.pageSize}`
            next = `/preduzeca?pageNumber=${response.data.pageNumber + 1}&pageSize=${response.data.pageSize}`

            res.send(getView("preduzeca")
            .replace("##TABLEDATA", view)
            .replace("##PAGES", pages)
            .replace("##PREVIOUS", previous)
            .replace("##NEXT", next)
            .replace("##DISABLEDPREV", response.data.pageNumber <= 1 ? "disabled" : "")
            .replace("##DISABLEDNEXT", response.data.pageNumber >= response.data.totalPages ? "disabled" : ""));
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

            let pages = ``;
            let previous = ``;
            let next = ``;

            for (let i = 0; i < response.data.totalPages; i++) {
                pages += `<li class="page-item"><a class="page-link ${response.data.pageNumber === i + 1 ? "active" : ""}" href="/preduzeca?pageNumber=${i + 1}&pageSize=${response.data.pageSize}">${i + 1}</a></li>`;
            }

            previous = `/preduzeca?pageNumber=${response.data.pageNumber - 1}&pageSize=${response.data.pageSize}`
            next = `/preduzeca?pageNumber=${response.data.pageNumber + 1}&pageSize=${response.data.pageSize}`

            res.send(getView("stavke")
            .replace("##TABLEDATA", view)
            .replace("##PAGES", pages)
            .replace("##PREVIOUS", previous)
            .replace("##NEXT", next)
            .replace("##DISABLEDPREV", response.data.pageNumber <= 1 ? "disabled" : "")
            .replace("##DISABLEDNEXT", response.data.pageNumber >= response.data.totalPages ? "disabled" : ""));
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

//IZMENA
app.get("/editPreduzece/:id", async (request: Request, response: Response) => {
    let view = getView("edit/preduzece");

    let options = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/get/${request.params["id"]}`,
        httpsAgent: agent
    };

    axios.request(options).then((res) => {
        view = view.replace("##ID", res.data.data.id)
                   .replace("##NAME", res.data.data.name)
                   .replace("##LASTNAME", res.data.data.lastName)
                   .replace("##PHONE", res.data.data.phoneNumber)
                   .replace("##EMAIL", res.data.data.email)
                   .replace("##COMPANYNAME", res.data.data.companyName)
                   .replace("##COMPANYADDRESS", res.data.data.companyAddress)
                   .replace("##VAT", res.data.data.vat);
    });

    await delay(500);

    response.send(view);
});
app.get("/editStavka/:id", async (request: Request, response: Response) => {
    let view = getView("edit/stavka");

    let options = {
        method: "GET",
        url: `http://localhost:${port}/api/Stavka/get/${request.params["id"]}`,
        httpsAgent: agent
    };

    axios.request(options).then((res) => {
        view = view.replace("##ID", res.data.data.id)
                   .replace("##NAME", res.data.data.name)
                   .replace("##PRICEPERUNIT", res.data.data.pricePerUnit)
                   .replace("##UNITOFMEASUREMENT", res.data.data.unitOfMeasurement)
                   .replace("##AMOUNT", res.data.data.amount);
    });

    await delay(500);

    response.send(view);
});
app.get("/editFaktura/:id", async (request: Request, response: Response) => {
    let view = getView("edit/faktura");

    let options = {
        method: "GET",
        url: `http://localhost:${port}/api/Faktura/get/byId/${request.params["id"]}`,
        httpsAgent: agent
    };

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
        //console.log(res.data.data)
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
        //console.log(res.data.data)
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

    let preduzecaDestStr = ``;
    let preduzecaOrigStr = ``;
    let stavkaStr = ``;
    let stavkeList = ``;
    

    axios.request(options).then((res) => {
        view = view.replace("##ID", res.data.data.id)
                   .replace("##DATEOFCREATION", new Date(Date.parse(res.data.data.dateOfCreating)).toLocaleDateString("en-CA"))
                   .replace("##PAYMENTDEADLINE", new Date(Date.parse(res.data.data.paymentDeadline)).toLocaleDateString("en-CA"));

        preduzeca.forEach(p => {
            preduzecaDestStr += `<option value="${p.id}" ${(p.vat === res.data.data.destinationCompanyVAT) ? "selected" : ""}>${p.companyName} ${p.vat}</option>`
            preduzecaOrigStr += `<option value="${p.id}" ${(p.vat === res.data.data.originCompanyVAT) ? "selected" : ""}>${p.companyName} ${p.vat}</option>`
        });

        stavke.forEach(s => {
            stavkaStr += `<option value="${s.id}" ${(s.id === res.data.data.items[0])? "selected" : ""}>${s.name} (${s.pricePerUnit} po ${s.unitOfMeasurement})</option>`;
        });

        let counter = 0;
        res.data.data.items.forEach((i: number) => {
            
            if (i !== 0) {
                let additionalStr = ``;

                stavke.forEach(s => {
                    additionalStr += `<option value="${s.id}" ${(s.id === res.data.data.items[i])? "selected" : ""}>${s.name} (${s.pricePerUnit} po ${s.unitOfMeasurement})</option>`;
                });

                stavkeList += `
                <div class="col mb-3" id="new-item-${i}">
                    <label for="item-${i}">Dodatna stavka ${i + 1}</label>
                    <select class="form-select mb-3" name="item-${i}" id="item-${i}">
                        <option value="" selected disabled>Odaberite stavku...</option>
                        ${additionalStr}
                    </select>
                    <button type="button" class="btn btn-secondary w-100 mb-3" onclick="removeNewItem(${i})">Ukloni stavku ${counter + 1}</button>
                </div>`;
                counter++;
            }
        });

        view = view.replace("##COMPANIESDEST", preduzecaDestStr)
                   .replace("##COMPANIESORIG", preduzecaOrigStr)
                   .replace("##ITEMS", stavkaStr)
                   .replace("##ADDITIONALITEMS", stavkeList)
                   .replace("##COUNTER", "" + counter)
                   .replace("##PRICETOTAL", "" + res.data.data.priceTotal)
                   .replace("##CHECKEDIN", res.data.data.type ? "checked" : "")
                   .replace("##CHECKEDOUT", res.data.data.type ? "" : "checked");


    }).catch(err => {
        console.log(err);
    });

    await delay(500);

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
app.get("/detailsPreduzece/:id/:pageNumber?/:pageSize?", async (request: Request, response: Response) => {

    let view = getView("details/detailsPreduzeca");

    let fakture: Array<Faktura> = new Array<Faktura>();

    let options = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/get/${request.params["id"]}`,
        httpsAgent: agent
    };

    let vat = "";

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

        vat = res.data.data.vat;

        let pages = ``;
        let previous = ``;
        let next = ``;

            for (let i = 0; i < res.data.totalPages; i++) {
                pages += `<li class="page-item"><a class="page-link ${res.data.pageNumber === i + 1 ? "active" : ""}" href="/detailsPreduzece/${res.data.data.id}?pageNumber=${i + 1}&pageSize=${res.data.pageSize}">${i + 1}</a></li>`;
            }

            previous = `/detailsPreduzece/${res.data.data.id}?pageNumber=${res.data.pageNumber - 1}&pageSize=${res.data.pageSize}`
            next = `/detailsPreduzece/${res.data.data.id}?pageNumber=${res.data.pageNumber + 1}&pageSize=${res.data.pageSize}`
        view = view
        .replaceAll("##NAME", res.data.data.companyName)
        .replaceAll("##EDIT", `/editFaktura/${res.data.data.id}`)
        .replaceAll("##DELETE", `/deleteFaktura/${res.data.data.id}`)
        .replace("##PAGES", pages)
        .replace("##PREVIOUS", previous)
        .replace("##NEXT", next)
        .replace("##DISABLEDPREV", res.data.pageNumber <= 1 ? "disabled" : "")
        .replace("##DISABLEDNEXT", res.data.pageNumber >= res.data.totalPages ? "disabled" : "");
    }).catch(err => {
        console.log(err);
    });

    await delay(500);

    //console.log("VAT: " + vat);

    let optionsFakture = {
        method: "GET",
        url: `http://localhost:${port}/api/Faktura/get/${vat}`,
        httpsAgent: agent
    };

    axios.request(optionsFakture).then((res) => {

        console.log(res.data.data);
        for (let i = 0; i < res.data.data.length; i++) {
            fakture.push({
                id: res.data.data[i].id,
                vat: res.data.data[i].destinationCompanyVAT,
                vatOfOrigin: res.data.data[i].originCompanyVAT,
                dateGenerated: res.data.data[i].dateOfCreating,
                dateDeadline: res.data.data[i].paymentDeadline,
                items: res.data.data[i].items,
                total: res.data.data[i].priceTotal,
                type: res.data.data[i].type
            });
        }
    }).catch(err => {
        console.log(err)
    });

    await delay(500);

    let faktureStr = ``;

    fakture.forEach(f => {
        let type = f.type ? "Ulazna" : "Izlazna"

        faktureStr = `
        <tr><td>${f.vat}</td>
        <td>${f.vatOfOrigin}</td>
        <td>${f.dateGenerated}</td>
        <td>${f.dateDeadline}</td>
        <td>${f.total}</td>
        <td>${type}</td>
        <td><a class="text-warning" href="/editFaktura/${f.id}"><i class="fa fa-pen"></i></a></td>
        <td><a class="text-danger" href="/deleteFaktura/${f.id}"><i class="fa fa-trash"></i></a></td>
        `
    });

    await delay(250);

    view = view.replace("##TABLEDATA", detailsStr).replace("##TABLEDATAFAKTURE", faktureStr);

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

    response.redirect("/preduzeca");
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

    response.redirect("/stavke");
});
app.post("/addFaktura", async (request: Request, response: Response) => {
    let optionsPreduzeca = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/get/all`,
        httpsAgent: agent

    }

    let preduzeca: Array<Preduzece> = new Array<Preduzece>();
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

    await delay(500);

    let destinationCompany = preduzeca.find(p => p.id === parseInt(request.body.destinationCompanyVAT));
    let originCompany = preduzeca.find(p => p.id === parseInt(request.body.originCompanyVAT));

    let stavke2: Array<Number> = new Array<Number>();

    stavke2.push(parseInt(request.body.item));

    for (let i = 0; i < request.body.counter; i++) {
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

    axios.request(options).then((res) => {
        console.log(res.data);
    }).catch(err => {
        console.log(err);
    });

    response.redirect("/preduzeca?pageNumber=1&pageSize=10");
})

/*PUT Methods*/
//IZMENE
app.post("/editPreduzece", async (request: Request, response: Response) => {
    let options = {
        method: "PUT",
        url: `http://localhost:${port}/api/Preduzece/edit`,
        httpsAgent: agent,
        data: {
            id: request.body.id,
            name: request.body.name,
            lastName: request.body.lastName,
            phoneNumber: request.body.phone,
            email: request.body.email,
            companyAddress: request.body.companyAddress,
            companyName: request.body.companyName,
            vat: request.body.vat
        }
    };

    axios.request(options).then((res) => {
        console.log(res.data);
    }).catch(err => {
        console.log(err);
    });

    response.redirect("/preduzeca");
});
app.post("/editStavka", async (request: Request, response: Response) => {
    let options = {
        method: "PUT",
        url: `http://localhost:${port}/api/Stavka/edit`,
        httpsAgent: agent,
        data: {
            id: request.body.id,
            name: request.body.name,
            pricePerUnit: request.body.pricePerUnit,
            unitOfMeasurement: request.body.unitOfMeasurement,
            amount: request.body.amount
        }
    };

    axios.request(options).then((res) => {
        console.log(res.data);
    }).catch(err => {
        console.log(err);
    });

    response.redirect("/stavke");
});
app.post("/editFaktura", async (request: Request, response: Response) => {
    let optionsPreduzeca = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/get/all`,
        httpsAgent: agent

    }

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

    let destinationCompany = preduzeca.find(p => p.id === parseInt(request.body.destinationCompanyVAT));
    let originCompany = preduzeca.find(p => p.id === parseInt(request.body.originCompanyVAT));

    let stavke2: Array<Number> = new Array<Number>();

    stavke2.push(parseInt(request.body.item));

    for (let i = 0; i < request.body.counter; i++) {
        stavke2.push(parseInt(request.body[`item-${i}`]));
    }

    let deadline = new Date(Date.parse(request.body.paymentDeadline));

    let type: Boolean = request.body.type === "in";

    let options = {
        method: "PUT",
        url: `http://localhost:${port}/api/Faktura/edit`,
        httpsAgent: agent,
        data: {
            id: 0,
            destinationCompanyVAT: destinationCompany?.vat,
            originCompanyVAT: originCompany?.vat,
            dateOfCreating: request.body.dateOfCreating,
            paymentDeadline: deadline,
            items: stavke2,
            type: type
        }
    };

    axios.request(options).then((res) => {
        console.log(res.data);
    }).catch(err => {
        console.log(err);
    });

    response.redirect("back");
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

//LISTENER
app.listen(client_port, () => { console.log(`Client started on port ${client_port}`); });