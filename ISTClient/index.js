"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const agent = new https_1.default.Agent({
    rejectUnauthorized: false,
    keepAlive: true
});
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
const port = 5077;
const client_port = 3001;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let getView = (view) => {
    return (0, fs_1.readFileSync)(path_1.default.join(`${__dirname}/view/${view}.html`), "utf-8");
};
//GET Methods
app.get('/', (req, res) => {
    res.send(getView("index"));
});
app.get('/preduzeca/:pageNumber?/:pageSize?', async (req, res) => {
    if (!req.query.pageNumber && !req.query.pageSize) {
        req.query.pageNumber = 1;
        req.query.pageSize = 10;
    }
    let options = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/get/preduzece?PageNumber=${req.query["pageNumber"]}&PageSize=${req.query["pageSize"]}`,
        httpsAgent: agent
    };
    //console.log(options.url);
    //console.log(req.query);
    axios_1.default.request(options).then((response) => {
        //console.log(response.data)
        let view = ``;
        if (response.data != null) {
            response.data.data.forEach((element) => {
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
        }
        ;
    }).catch(function (error) {
        console.error(error);
    });
});
app.get('/stavke/:pageNumber?/:pageSize?', async (req, res) => {
    if (!req.query.pageNumber && !req.query.pageSize) {
        req.query.pageNumber = 1;
        req.query.pageSize = 10;
    }
    let options = {
        method: "GET",
        url: `http://localhost:${port}/api/Stavka/get/stavka?PageNumber=${req.query["pageNumber"]}&PageSize=${req.query["pageSize"]}`,
        httpsAgent: agent
    };
    //console.log(options.url);
    //console.log(req.query);
    axios_1.default.request(options).then((response) => {
        //console.log(response.data)
        let view = ``;
        if (response.data != null) {
            response.data.data.forEach((element) => {
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
        }
        ;
    }).catch(function (error) {
        console.error(error);
    });
});
app.get("/addPreduzece", async (request, response) => {
    response.send(getView("add/preduzece"));
});
app.get("/addStavka", async (request, response) => {
    let view = getView("add/stavka");
    response.send(view);
});
app.get("/addFaktura", async (request, response) => {
    let optionsPreduzeca = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/get/preduzece/all`,
        httpsAgent: agent
    };
    let optionsStavke = {
        method: "GET",
        url: `http://localhost:${port}/api/Stavka/get/stavka/all`,
        httpsAgent: agent
    };
    let preduzeca = new Array();
    let stavke = new Array();
    let today = new Date();
    axios_1.default.request(optionsPreduzeca).then(async (res) => {
        console.log(res.data.data);
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
    axios_1.default.request(optionsStavke).then(async (res) => {
        console.log(res.data.data);
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
        preduzecaStr += `<option value="${p.id}">${p.companyName} ${p.vat}</option>`;
    });
    stavke.forEach(s => {
        stavkeStr += `<option value="${s.id}">${s.name} (${s.pricePerUnit} po ${s.unitOfMeasurement})</option>`;
    });
    view = view.replaceAll("##COMPANIES", preduzecaStr).replaceAll("##ITEMS", stavkeStr);
    response.send(view);
});
app.get("/bilans", async (request, response) => {
    let view = getView("bilans");
    let optionsPreduzeca = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/get/preduzece/all`,
        httpsAgent: agent
    };
    let preduzeca = new Array();
    axios_1.default.request(optionsPreduzeca).then(async (res) => {
        console.log(res.data.data);
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
        preduzecaStr += `<option value="${p.id}">${p.companyName} ${p.vat}</option>`;
    });
    view = view.replaceAll("##COMPANIES", preduzecaStr);
    response.send(view);
});
//POST Methods
app.post("/addPreduzece", (request, response) => {
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
    axios_1.default.request(options).then(response => {
        console.log(response.data);
    }).catch(err => {
        console.log(err);
    });
    response.redirect("/preduzeca?pageNumber=1&pageSize=10");
});
app.post("/addStavka", (request, response) => {
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
    axios_1.default.request(options).then(res => {
        console.log(res.data);
    }).catch(err => {
        console.log(err);
    });
});
app.post("/addFaktura", async (request, response) => {
    let optionsPreduzeca = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/get/preduzece/all`,
        httpsAgent: agent
    };
    let optionsStavke = {
        method: "GET",
        url: `http://localhost:${port}/api/Stavka/get/stavka/all`,
        httpsAgent: agent
    };
    let preduzeca = new Array();
    let stavke = new Array();
    let today = new Date();
    axios_1.default.request(optionsPreduzeca).then(async (res) => {
        console.log(res.data.data);
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
    axios_1.default.request(optionsStavke).then(async (res) => {
        console.log(res.data.data);
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
    // console.log(preduzeca);
    // console.log(stavke);
    let destinationCompany = preduzeca.find(p => p.id === parseInt(request.body.destinationCompanyVAT));
    let originCompany = preduzeca.find(p => p.id === parseInt(request.body.originCompanyVAT));
    let stavke2 = new Array();
    //console.log(destinationCompany);
    //console.log(originCompany);
    //console.log(request.body);
    let prvaStavka = stavke.find(s => s.id === parseInt(request.body.item));
    stavke2.push(prvaStavka);
    for (let i = 0; i < request.body.counter; i++) {
        let stavka = stavke.find(s => s.id === parseInt(request.body[`item-${i}`]));
        stavke2.push(stavka);
    }
    let deadline = new Date(Date.parse(request.body.paymentDeadline));
    let type = request.body.type === "in";
    let options = {
        method: "POST",
        url: `http://localhost:${port}/api/Faktura/add/faktura`,
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
    axios_1.default.request(options).then((res) => {
        console.log(res.data);
    }).catch(err => {
        console.log(err);
    });
    response.redirect("/preduzeca?pageNumber=1&pageSize=10");
});
//PUT Methods
app.put("/editPreduzece/:id", async (request, response) => {
    let view = getView("edit/preduzece");
    response.send(view);
});
app.put("/editStavka/:id", async (request, response) => {
    let view = getView("edit/stavka");
    response.send(view);
});
app.put("/editFaktura/:id", async (request, response) => {
    let view = getView("edit/faktura");
    response.send(view);
});
//DELETE Methods
app.get("/deletePreduzece/:id", (request, response) => {
    axios_1.default.delete(`http://localhost:${port}/api/Preduzece/delete/preduzece/${request.params["id"]}`);
    response.redirect("/preduzeca?pageNumber=1&pageSize=10");
});
app.get("/deleteStavka/:id", (request, response) => {
    axios_1.default.delete(`http://localhost:${port}/api/Stavka/delete/stavka/${request.params["id"]}`);
    response.redirect("/stavke?pageNumber=1&pageSize=10");
});
app.get("/deleteFaktura/:id", (request, response) => {
    axios_1.default.delete(`http://localhost:${port}/api/Faktura/delete/faktura/${request.params["id"]}`);
    response.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    response.redirect("back");
});
app.listen(client_port, () => { console.log(`Client started on port ${client_port}`); });
