const express = require('express');
const path = require('path');
const app = express();
const copyServer = require("./controllers/copyServer");
const renameFuncs = require("./controllers/renameFuncs");
const getOriginalExpressAppObj = require("./controllers/getOriginalExpressAppObj");
const getRenamedExpressAppObj = require("./controllers/getRenamedExpressAppObj");
const mergeTrees = require('./controllers/mergeTrees');
const addClose = require('./controllers/addClose')
const mergeDispatcher = require('./controllers/mergeDispatchers')

const PORT = 3003;
/**
 * handle parsing request body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods','POST');
  res.header('Access-Control-Allow-Headers','Content-Type, Authorization');
  next();
});

//at homepage - on endpoint main, send main page to front end

//req.body will have the serverDir and the serverFile
  //copy full server from filepath (shell command?)
  //clone the copied server to a renamed server
  //get the express app obj of both sevrers (might require a shell command)
  //run mergeTrees and send the finalObj back as a response


// app.post('/routes', copyServer, addClose, renameFuncs, getOriginalExpressAppObj, getRenamedExpressAppObj, mergeTrees, (req, res) => {
app.post('/routes', copyServer, addClose, renameFuncs, getOriginalExpressAppObj, getRenamedExpressAppObj, mergeDispatcher, (req, res) => {
  console.log('at end of server route')
  console.log(res.locals.tree)
  res.status(200).json(res.locals.tree)
});

// app.listen(PORT, (err) => {
//   if (err) console.log(err);
//   else console.log(`Listening to port: ${PORT}`);
// });

module.exports = app;