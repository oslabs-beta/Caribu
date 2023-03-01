var express = require('express');
var path = require('path');
var app = express();
var copyServer = require("./controllers/copyServer");
var renameFuncs = require("./controllers/renameFuncs");
var getOriginalExpressAppObj = require("./controllers/getOriginalExpressAppObj");
var getRenamedExpressAppObj = require("./controllers/getRenamedExpressAppObj");
var mergeTrees = require('./controllers/mergeTrees');
var addClose = require('./controllers/addClose');
var mergeDispatcher = require('./controllers/mergeDispatchers');
var PORT = 3003;
/**
 * handle parsing request body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
//at homepage - on endpoint main, send main page to front end
//req.body will have the serverDir and the serverFile
//copy full server from filepath (shell command?)
//clone the copied server to a renamed server
//get the express app obj of both sevrers (might require a shell command)
//run mergeTrees and send the finalObj back as a response
// app.post('/routes', copyServer, addClose, renameFuncs, getOriginalExpressAppObj, getRenamedExpressAppObj, mergeTrees, (req, res) => {
app.post('/routes', copyServer, addClose, renameFuncs, getOriginalExpressAppObj, getRenamedExpressAppObj, mergeDispatcher, function (req, res) {
    console.log('at end of server route');
    console.log(res.locals.tree);
    res.status(200).json(res.locals.tree);
});
app.listen(PORT, function (err) {
    if (err)
        console.log(err);
    else
        console.log("Listening to port: ".concat(PORT));
});
