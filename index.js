var express = require('express');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const bodyParser = require('body-parser');
const swDocument = require('./swagger.json');
const {Progect,ProgectSite,SiteMap,MapFileUpdate,ErrolList} = require('./db.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
require('dotenv').config()
var app = express();
const port = process.env.PORT || 3001;
const host = process.env.HOST || "10.100.100.62";
const { DB } = require('./db.js');
const indexHTML = path.resolve(__dirname,'site/index.html');
var CryptoJS = require("crypto-js");









app.use(bodyParser.json()); // Used to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static('site'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.get('/api/getAllProgect/',async function(req, res) {
    redd=await Progect.findAll();
    res.status(200).send(redd)
});
app.get('/api/AddProgect/',async function(req, res) {
    try {
        redd=await Progect.create({
            "NAME":req.query["NAME"],
            "CONTACT_PHONE":req.query["CONTACT_PHONE"],
            "CONTACT_EMAIL":req.query["CONTACT_EMAIL"],
            "INN":req.query["INN"],
            "KPP":req.query["KPP"],
            "BIK":req.query["BIK"],
            "COMPANY_ADRESS":req.query["COMPANY_ADRESS"],
        });
        res.status(200).send(redd)
    } catch (error) {
        res.status(500).send(error)
    }
});
app.get('/api/UpdateProgect/:id',async function(req, res) {
    try {
        redd=await Progect.update({
            "NAME":req.query["NAME"],
            "CONTACT_PHONE":req.query["CONTACT_PHONE"],
            "CONTACT_EMAIL":req.query["CONTACT_EMAIL"],
            "INN":req.query["INN"],
            "KPP":req.query["KPP"],
            "BIK":req.query["BIK"],
            "COMPANY_ADRESS":req.query["COMPANY_ADRESS"],
        },{where: { "ID": req.params.id }});
        res.status(200).send(redd)
    } catch (error) {
        res.status(500).send(error)
    }
});
app.get('/api/getProgectById/:id',async function(req, res) {
    redd = await Progect.findOne({ where: { "ID": req.params.id },include:[{
        model: ProgectSite, as: 'SITES' ,include:[{
            model: SiteMap, as: 'MAP' ,include:[{
                model: MapFileUpdate, as: 'ROW_UPDATE' 
            }]
        }]
    }] });
    res.status(200).send(redd)
});
app.get('/api/deleteProgect/:id',async function(req, res) {
    try {
        
        Progect.findOne({ where: { "ID": req.params.id },include:[{
            model: ProgectSite, as: 'SITES' ,include:[{
                model: SiteMap, as: 'MAP' ,include:[{
                    model: MapFileUpdate, as: 'ROW_UPDATE' 
                }]
            }]
        }]}).then(async (result) => {
            if(result?.SITES?.length>0){
                result.SITES.forEach(async (element) => {
                    if(element?.MAP?.length>0){
                        element.MAP.forEach(async (elementMap) => {
                            if(element?.ROW_UPDATE?.length>0){
                                element.ROW_UPDATE.forEach(async (elementMapFile) => {
                                    await MapFileUpdate.destroy({ where: { "ID": elementMapFile["ID"] }});
                                });
                            }
                            await SiteMap.destroy({ where: { "ID": elementMap["ID"] }});
                        });
                    }
                    await ProgectSite.destroy({ where: { "ID": element["ID"] }});
                });
            }
            await Progect.destroy({ where: { "ID": req.params.id }});
            res.status(200).send(true)
        });
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
});
app.get('/api/getSiteById/:id',async function(req, res) {
    redd = await ProgectSite.findOne({ where: { "ID": req.params.id },include:[{model: SiteMap, as: 'MAP'}] });
    res.status(200).send(redd)
});

app.get('/api/AddSiteProgect/',async function(req, res) {
    try {
        redd=await ProgectSite.create({
            "NAME":req.query["NAME"],
            "PROGECT_ID":req.query["PROGECT_ID"],
            "URL":req.query["CONTURLACT_EMAIL"],
            "ADMIN_LOGIN":req.query["ADMIN_LOGIN"],
            "ADMIN_PASSWORD":req.query["ADMIN_PASSWORD"],
        });
        res.status(200).send(redd)
    } catch (error) {
        res.status(500).send(error)
    }
});
app.get('/api/getFileAll',async function(req, res) {
    redd = await SiteMap.findAll();
    res.status(200).send(redd)
});
app.get('/api/getFileById/:id',async function(req, res) {
    redd = await SiteMap.findOne({ where: { "ID": req.params.id },include:[{model: MapFileUpdate, as: 'ROW_UPDATE'}] });
    res.status(200).send(redd)
});
app.get('/api/AddFileProgect/',async function(req, res) {
    try {
        redd=await SiteMap.create({
            "NAME":req.query["NAME"],
            "DESCRIPTION":req.query["DESCRIPTION"],
            "SITE_ID":req.query["SITE_ID"],
            "URL":req.query["URL"],
        });
        res.status(200).send(redd)
    } catch (error) {
        res.status(500).send(error)
    }
});
app.get('/api/AddRowFile/',async function(req, res) {
    try {
        redd=await MapFileUpdate.create({
            "FILE_ID":req.query["FILE_ID"],
            "DESCRIPTION":req.query["DESCRIPTION"],
            "ROW_ID":req.query["ROW_ID"],
            "OLD_CODE":req.query["OLD_CODE"],
            "NEW_CODE":req.query["NEW_CODE"],
        });
        res.status(200).send(redd)
    } catch (error) {
        res.status(500).send(error)
    }
});


app.post('/api/getAllError/',async function(req, res) {
    var numPage=Number(req.body["numPage"]?req.body["numPage"]:1)
    var CountPage=Number(req.body["CountPage"]?req.body["CountPage"]:10)
    redd=await ErrolList.findAndCountAll({
        offset:((numPage-1)*CountPage),
        limit : CountPage,
    });
    res.status(200).send(redd)
});
app.post('/api/AddError/',async function(req, res) {
    try {
        redd=await ErrolList.create({
            "NAME":req.body["NAME"],
            "DESCRIPTION_ERROR":CryptoJS.DES.decrypt(req.body["DESCRIPTION_ERROR"], 'DES').toString(CryptoJS.enc.Utf8),
            "DESCRIPTION":CryptoJS.DES.decrypt(req.body["DESCRIPTION"], 'DES').toString(CryptoJS.enc.Utf8),
        });
        res.status(200).send(redd)
    } catch (error) {
        res.status(500).send(error)
    }
});
app.post('/api/UpdateError/:id',async function(req, res) {
    try {
        redd=await ErrolList.update({
            "NAME":req.body["NAME"],
            "DESCRIPTION_ERROR":CryptoJS.DES.decrypt(req.body["DESCRIPTION_ERROR"], 'DES').toString(CryptoJS.enc.Utf8),
            "DESCRIPTION":CryptoJS.DES.decrypt(req.body["DESCRIPTION"], 'DES').toString(CryptoJS.enc.Utf8),
        },{where: { "ID": req.params.id }});
        res.status(200).send(redd)
    } catch (error) {
        res.status(200).send(error)
    }
});
app.get('/api/getErrorById/:id',async function(req, res) {
    redd = await ErrolList.findOne({ where: { "ID": req.params.id }});
    res.status(200).send(redd)
});
app.get('/api/deleteError/:id',async function(req, res) {
    try {
        await ErrolList.destroy({ where: { "ID":req.params.id  }});
        res.status(200).send(true)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
});
app.post('/api/searchError/',async function(req, res) {
    try {
        redd=await ErrolList.findAndCountAll({where: {
            [Op.or]: [{
                "NAME": {
                    [Op.like]: Sequelize.literal('\'%'+CryptoJS.DES.decrypt(req.body["INPUT"], 'DES').toString(CryptoJS.enc.Utf8)+'%\'')
                }
            }, {
                "DESCRIPTION_ERROR": {
                    [Op.like]: Sequelize.literal('\'%'+CryptoJS.DES.decrypt(req.body["INPUT"], 'DES').toString(CryptoJS.enc.Utf8)+'%\'')
                }
            }, {
                "DESCRIPTION": {
                    [Op.like]: Sequelize.literal('\'%'+CryptoJS.DES.decrypt(req.body["INPUT"], 'DES').toString(CryptoJS.enc.Utf8)+'%\'')
                }
            }]
        }});
        res.status(200).send(redd)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
});

app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swDocument));

app.get('/*', function(req, res) {
    res.sendFile(indexHTML);
});

app.listen(port, host, function () {
    console.log(`Server listens http://${host}:${port}`)
})