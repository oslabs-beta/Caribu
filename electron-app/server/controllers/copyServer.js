const fs = require("fs");
const { copiedServer, renamedServer, node_modules, processFolder } = require("./serverDirPaths");
const copyServer = (req, res, next) => {
  console.log("IN COPYSERVER");
  //make sure process folder exists
  if (!fs.existsSync(processFolder)) { // The fs.existsSync() method is used to synchronously check if a file already exists in the given path or not. It returns a boolean value which indicates the presence of a file.
    fs.mkdirSync(processFolder) // The fs.mkdirSync() method is an inbuilt application programming interface of fs module which provides an API for interacting with the file system in a manner closely modeled around standard POSIX functions.
  }

  //clear out any existing copied server
  if (fs.existsSync(copiedServer)) {
    fs.rmSync(copiedServer, { recursive: true, force: true });
  }
  //make a new one
  fs.mkdirSync(copiedServer);
  //copy a folder into there from somewhere (ideally, req.body,something)
  fs.cpSync( /** https://nodejs.org/api/fs.html#fscpsyncsrc-dest-options */
    // "/Users/justinribs/repos/unit-9-express-practice/server",
    // '/Users/morry/git/bodegaCat/server/',
    // '/Users/morry/git/cs/juniorUnits/unit-9-express/server',
    // '/Users/morry/git/node-express-realworld-example-app',
    //'/Users/morry/git/cs/juniorUnits/unit-10-databases/server',
    // '/Users/melodyduany/Documents/Codesmith/projects/node-express-realworld-example-app',
    // '/Users/melodyduany/Documents/Codesmith/challenges/unit-9-express/server',
    // '/Users/melodyduany/Documents/Codesmith/challenges/unit-9-express-morrie/server',
    req.body.filepath,
    copiedServer,
    { recursive: true },
    (err) => {
      console.log(err);
    }
    );
  
  // clear out any existing copied node_modules
  if (fs.existsSync(node_modules)) {
    fs.rmSync(node_modules, { recursive: true, force: true });
  }
  // make a new one
  fs.mkdirSync(node_modules);
  //copy a folder into there from somewhere (ideally, req.body,something)
  fs.cpSync(
    // "/Users/justinribs/repos/unit-9-express-practice/server",
    // '/Users/morry/git/bodegaCat/server/',
    // '/Users/morry/git/node-express-realworld-example-app/node_modules',
    // '/Users/morry/git/cs/juniorUnits/unit-10-databases/node_modules',
    // '/Users/melodyduany/Documents/Codesmith/projects/node-express-realworld-example-app/node_modules',
    // '/Users/melodyduany/Documents/Codesmith/challenges/unit-9-express/node_modules',
    // '/Users/melodyduany/Documents/Codesmith/challenges/unit-9-express-morrie/node_modules',
    req.body.nodepath,
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
