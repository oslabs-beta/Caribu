//This is not the true backend, it is simply a server for front end testing.
var express = require('express');
var path = require('path');
var app = express();
var copyServer = require("./controllers/copyServer");
var renameFuncs = require("./controllers/renameFuncs");
var getOriginalExpressAppObj = require("./controllers/getOriginalExpressAppObj");
var getRenamedExpressAppObj = require("./controllers/getRenamedExpressAppObj");
var mergeTrees = require('./controllers/mergeTrees');
var PORT = 6969;
/**
 * handle parsing request body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//at homepage - on endpoint main, send main page to front end
//req.body will have the serverDir and the serverFile
//copy full server from filepath (shell command?)
//clone the copied server to a renamed server
//get the express app obj of both sevrers (might require a shell command)
//run mergeTrees and send the finalObj back as a response
app.post('/routes', copyServer, renameFuncs, getOriginalExpressAppObj, getRenamedExpressAppObj, mergeTrees, function (req, res) {
    console.log('at end of server route');
    console.log(res.locals.tree);
    res.status(200).json(res.locals.tree);
    // res.json(
    //   {
    //     routeName: '/character',
    //     routeMethods: {
    //       GET: {
    //         middlewares: [{
    //           functionInfo: {
    //             funcName: 'getCharacters',
    //             funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
    //             funcPosition: [6, 40],
    //             funcDef: 'lorem ipsum dolor sit amet',
    //           }
    //         }]
    //       },
    //       POST: {
    //         middlewares: [{
    //           functionInfo: {
    //             funcName: 'addCharacter',
    //             funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
    //             funcPosition: [102, 119],
    //             funcDef: 'tbh i dont know hehe',
    //           }
    //         }]
    //       }
    //     }
    //   },
    //   {
    //     routeName: '/species',
    //     routeMethods: {
    //       GET: {
    //         middlewares: [{
    //           functionInfo: {
    //             funcName: 'getCharacters',
    //             funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
    //             funcPosition: [6, 40]
    //           }
    //         }]
    //       }
    //     }
    //   });
});
app.listen(PORT, function (err) {
    if (err)
        console.log(err);
    else
        console.log("Listening to port: ".concat(PORT));
});
