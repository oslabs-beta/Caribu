//This is not the true backend, it is simply a server for front end testing.

const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
// const { copiedServer, renamedServer } = require("./serverDirPaths");
const copyServer = require("./controllers/copyServer");
const renameFuncs = require("./controllers/renameFuncs");
const getOriginalExpressAppObj = require("./controllers/getOriginalExpressAppObj");
const getRenamedExpressAppObj = require("./controllers/getRenamedExpressAppObj");

console.log(copyServer);
console.log(renameFuncs);

const PORT = 6969;
``;
/**
 * handle parsing request body
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//at homepage - on endpoint main, send main page to front end

//req.body will have the serverDir and the serverFile
//copy full server from filepath (shell command?
//clone the copied server to a renamed server
//get the express app obj of both sevrers (might require a shell command)
//run mergeTrees and send the finalObj back as a response
// fs.rmSync(copiedServer, { recursive: true, force: true });
// fs.mkdirSync(copiedServer);
// fs.cp(
//   "/Users/justinribs/repos/unit-9-express-practice",
//   copiedServer,
//   { recursive: true },
//   (err) => {
//     console.log(err);
//   }
// );
// require in getOriginalExpressAppObj.js and getRenamedExpressAppOb.js
// require("/Users/justinribs/OSP/Caribu/electron-app/server/expressTest/appMap/getOriginalExpressAppObj.js");
// console.log("console log");
// require("/Users/justinribs/OSP/Caribu/electron-app/server/expressTest/appMap/getRenamedExpressAppObj_dep.js");

// let runOriginalFirst = async (req, res, next) => {
//   await setTimeout(() => {
//     console.log("BRUHBRUHBRUHBRUHBRUHBRUHBRUHBRUHBRUH");
//     require("/Users/justinribs/OSP/Caribu/electron-app/server/expressTest/appMap/getOriginalExpressAppObj.js");
//   }, 5000);
//   next();
// };

// let runRenamedSecond = async (req, res, next) => {
//   await setTimeout(() => {
//     console.log("BRUHBRUHBRUHBRUHBRUHBRUHBRUHBRUHBRUH");
//     require("/Users/justinribs/OSP/Caribu/electron-app/server/expressTest/appMap/getRenamedExpressAppObj.js");
//   }, 5000);
//   next();
// };

app.post(
  "/routes",
  copyServer,
  renameFuncs,
  getOriginalExpressAppObj,
  getRenamedExpressAppObj,
  (req, res) => {
    // app.post("/routes", renameFuncs, (req, res) => {
    res.json(
      {
        routeName: "/character",
        routeMethods: {
          GET: {
            middlewares: [
              {
                functionInfo: {
                  funcName: "getCharacters",
                  funcFile:
                    "/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js",
                  funcPosition: [6, 40],
                  funcDef: "lorem ipsum dolor sit amet",
                },
              },
            ],
          },
          POST: {
            middlewares: [
              {
                functionInfo: {
                  funcName: "addCharacter",
                  funcFile:
                    "/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js",
                  funcPosition: [102, 119],
                  funcDef: "tbh i dont know hehe",
                },
              },
            ],
          },
        },
      },
      {
        routeName: "/species",
        routeMethods: {
          GET: {
            middlewares: [
              {
                functionInfo: {
                  funcName: "getCharacters",
                  funcFile:
                    "/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js",
                  funcPosition: [6, 40],
                },
              },
            ],
          },
        },
      }
    );
  }
);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Listening to port in server: ${PORT}`);
});
