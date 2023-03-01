const express = require("express");
const path = require("path");
const server = express();
const copyServer = require("./controllers/copyServer");
const renameFuncs = require("./controllers/renameFuncs");
const getOriginalExpressAppObj = require("./controllers/getOriginalExpressAppObj");
const getRenamedExpressAppObj = require("./controllers/getRenamedExpressAppObj");
const mergeTrees = require("./controllers/mergeTrees");
const PORT = 3003;
/**
 * handle parsing request body
 */
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
//at homepage - on endpoint main, send main page to front end
//req.body will have the serverDir and the serverFile
//copy full server from filepath (shell command?)
//clone the copied server to a renamed server
//get the express server obj of both servers (might require a shell command)
//run mergeTrees and send the finalObj back as a response
server.post("/routes", (req, res, next) => {
    console.log(req.body);
    return next();
}, copyServer, renameFuncs, getOriginalExpressAppObj, getRenamedExpressAppObj, mergeTrees, (req, res) => {
    console.log("at end of server route");
    console.log(res.locals.tree);
    res.status(200).json(res.locals.tree);
});
function serverListen() {
    server.listen(PORT, (err) => {
        if (err)
            console.log(err);
        else
            console.log(`Listening to port: ${PORT}`);
    });
}
console.log("hi is the ts being compiled???");
module.exports = serverListen;
//# sourceMappingURL=server.js.map