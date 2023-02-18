var _a = require("../../controllers/serverDirPaths.js"),
  renamedServer = _a.renamedServer,
  copiedServer = _a.copiedServer;
var acorn = require("acorn");
var walk = require("acorn-walk");
var fs = require("fs");
var path = require("path");
var counter = 0;
// babel modules
var parser = require("@babel/parser");
var generate = require("@babel/generator")["default"];
// const { default } = generate
// this is some weird require vs. import thing.
// see https://github.com/babel/babel/issues/13855
var _traverse = require("@babel/traverse");
var traverse = _traverse["default"];
//
// this is the main transform function. It takes code, parses it, renames all its arrow functions, transforms it back into code, and returns it
var babelTransform = function (code, filePath) {
  // assign replace the value of using the `arrowToNamed` plugin on the passed in code. Which will return an object of which we only want code for now.
  var replace = require("@babel/core").transformSync(code, {
    plugins: [
      [
        "./arrowToNamed",
        {
          fileName: filePath,
        },
      ],
    ],
    comments: true,
    retainLines: true,
  }).code;
  // console.log(replace)
  // return replace.cod
  //return it
  return replace;
};
var oldDirectoryPathOG = "../../copiedServer";
var newDirectoryPath = "../../copiedServerNamed";
var oldDir = path.join(__dirname, oldDirectoryPathOG);
// const oldDirectoryPathOG: string = "../copiedServer";
// const newDirectoryPath: string = "../copiedServerNamed";
//process the directory recursively
var processDirectory = function (oldDirectoryPath) {
  //if error, give error
  fs.readdir(oldDir, function (error, files) {
    if (error) {
      console.error("Error reading directory: ".concat(error));
      return;
    }
    // make a matching path in the new directory to match that of the old directory
    // this make sure we retain directory structure as we go down its folder trees
    var newDirectorySubPath = oldDirectoryPath.replace(
      oldDir,
      newDirectoryPath
    );
    console.log(newDirectorySubPath);
    //for each file
    files.forEach(function (fileName) {
      //make its old and new filePaths
      var oldFilePath = "".concat(oldDir, "/").concat(fileName);
      var newFilePath = "".concat(newDirectorySubPath, "/").concat(fileName);
      //check info about the file
      fs.stat(oldFilePath, function (error, stat) {
        //if there's an error, give an error
        if (error) {
          console.error("Error getting file stats: ".concat(error));
          return;
        }
        //if it's a directory (folder) and not a file, then we want to recursively process the files/folders in it
        if (stat.isDirectory()) {
          console.log(oldFilePath + " is a directory");
          console.log(newFilePath);
          //make a new folder where none exists
          fs.mkdirSync(newFilePath);
          //recursively process files
          processDirectory(oldFilePath);
        }
        //else, if its a js file, then process it
        //THIS IS A BIG BOTTLENECK VVVVV -- if we want to support anything other than js (like .ts, .svelte, etc. this is where we gotta start)
        else if (fileName.endsWith(".js")) {
          //get the file
          fs.readFile(oldFilePath, "utf-8", function (error, code) {
            //if error, give error
            if (error) {
              console.error("Error reading file: ".concat(error));
              return;
            }
            //make a clean filepath for the babel parser
            var cleanFilePath = oldFilePath
              .replaceAll("/", "$")
              .replaceAll(".", "_");
            cleanFilePath = cleanFilePath.slice(1);
            //invoke the transform and give the result to modified code
            var modifiedCode = babelTransform(code, cleanFilePath);
            console.log(
              "writing '"
                .concat(oldFilePath, "' to '")
                .concat(newDirectorySubPath, "' ")
            );
            fs.writeFile(newFilePath, modifiedCode, function (error) {
              if (error) console.error("Error writing file: ".concat(error));
            });
          });
        }
      });
    });
  });
};
processDirectory(oldDirectoryPathOG);
