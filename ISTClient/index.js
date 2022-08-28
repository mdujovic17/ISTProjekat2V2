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
let getView = (view) => {
    return (0, fs_1.readFileSync)(path_1.default.join(`${__dirname}/view/${view}.html`), "utf-8");
};
app.get('/', (req, res) => {
    res.send(getView("index"));
});
app.get('/preduzeca/:pageNumber?/:pageSize?', (req, res) => {
    if (!req.query.pageNumber && !req.query.pageSize) {
        req.query.pageNumber = 1;
        req.query.pageSize = 10;
    }
    let options = {
        method: "GET",
        url: `http://localhost:${port}/api/Preduzece/get/preduzece?PageNumber=${req.query["pageNumber"]}&PageSize=${req.query["pageSize"]}`,
        httpsAgent: agent
    };
    console.log(options.url);
    console.log(req.query);
    axios_1.default.request(options).then((response) => {
        console.log(response.data);
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
                
                    <td><a class="text-info" href="/details/${element.id}"><i class="fa fa-circle-info"></i></a></td>
                    <td><a class="text-warning" href="/edit/${element.id}"><i class="fa fa-pen"></i></a></td>
                    <td><a class="text-danger" href="/delete/${element.id}"><i class="fa fa-trash"></i></a></td>
                </tr>`;
            });
            res.send(getView("preduzeca").replace("##TABLEDATA", view));
        }
        ;
    }).catch(function (error) {
        console.error(error);
    });
});
app.listen(client_port, () => { console.log(`Client started on port ${client_port}`); });
