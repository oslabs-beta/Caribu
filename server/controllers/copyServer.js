const fs = require("fs");
const { copiedServer, renamedServer, node_modules, processFolder } = require("./serverDirPaths");
const copyServer = (req, res, next) => {
  console.log("IN COPYSERVER");
  //make sure process folder exists
  if (!fs.existsSync(processFolder)) {
    fs.mkdirSync(processFolder)
  }

  //clear out any existing copied server
  if (fs.existsSync(copiedServer)) {
    fs.rmSync(copiedServer, { recursive: true, force: true });
  }
  //make a new one
  fs.mkdirSync(copiedServer);
  //copy a folder into there from somewhere (ideally, req.body,something)
  fs.cpSync(
    // "/Users/justinribs/repos/unit-9-express-practice/server",
    // '/Users/morry/git/bodegaCat/server/',
    // '/Users/morry/git/cs/juniorUnits/unit-9-express/server',
    // '/Users/morry/git/node-express-realworld-example-app',
    '/Users/morry/git/cs/juniorUnits/unit-10-databases/server',
    copiedServer,
    { recursive: true },
    (err) => {
      console.log(err);
    }
    );
  
  if (fs.existsSync(node_modules)) {
    fs.rmSync(node_modules, { recursive: true, force: true });
  }
  fs.mkdirSync(node_modules);
  //copy a folder into there from somewhere (ideally, req.body,something)
  fs.cpSync(
    // "/Users/justinribs/repos/unit-9-express-practice/server",
    // '/Users/morry/git/bodegaCat/server/',
    // '/Users/morry/git/node-express-realworld-example-app/node_modules',
    '/Users/morry/git/cs/juniorUnits/unit-10-databases/node_modules',
    node_modules,
    { recursive: true },
    (err) => {
      console.log(err);
    }
    );

  if (fs.existsSync(renamedServer)) {
    fs.rmSync(renamedServer, { recursive: true, force: true });
  }
  fs.mkdirSync(renamedServer)


  console.log("BEFORE NEXT IN CPSERVER");
  next();
};

module.exports = copyServer;
