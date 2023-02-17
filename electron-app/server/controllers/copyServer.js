const fs = require("fs");
const { copiedServer, renamedServer } = require("./serverDirPaths");
const copyServer = (req, res, next) => {
  console.log("IN COPYSERVER");
  fs.rmSync(copiedServer, { recursive: true, force: true });
  fs.mkdirSync(copiedServer);
  fs.cpSync(
    // "/Users/justinribs/repos/unit-9-express-practice/server",
    // '/Users/morry/git/bodegaCat/server/',
    '/Users/morry/git/cs/juniorUnits/unit-9-express/server',
    copiedServer,
    { recursive: true },
    (err) => {
      console.log(err);
    }
  );
  console.log("BEFORE NEXT IN CPSERVER");
  next();
};

module.exports = copyServer;
