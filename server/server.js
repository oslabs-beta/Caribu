var express = require('express');
var path = require('path');
var app = express();
var copyServer = require("./controllers/copyServer");
var renameFuncs = require("./controllers/renameFuncs");
var getOriginalExpressAppObj = require("./controllers/getOriginalExpressAppObj");
var getRenamedExpressAppObj = require("./controllers/getRenamedExpressAppObj");
var mergeTrees = require('./controllers/mergeTrees');
var PORT = 3003;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.post('/routes', copyServer, renameFuncs, getOriginalExpressAppObj, getRenamedExpressAppObj, mergeTrees, function (req, res) {
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
