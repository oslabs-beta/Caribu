const renameFuncs = (req, res, next) => {
  console.log("IN RENAME FUNCS");
  const fs = require("fs");
  const { copiedServer, renamedServer } = require("./serverDirPaths");

  //plugin paths
  const { arrowToNamed, declarationToNewDeclaration, expressionToDeclaration } = require("./pluginPaths");
  
  // babel modules
  const parser = require("@babel/parser");
  const generate = require("@babel/generator").default;

  // this is some weird require vs. import thing.
  // see https://github.com/babel/babel/issues/13855
  // const _traverse = require("@babel/traverse");
  // const traverse = _traverse.default;
  const traverse = require("@babel/traverse").default;


  // this is the main transform function. It takes code, parses it, renames all its arrow functions, transforms it back into code, and returns it
  const babelTransform = (code: string, filePath: string): string => {
    //make a library of function declarations you're changing
    let funcDecLibrary = {}
    //first, look for all function declarations and rename them
    const ast = parser.parse(code)
    // let newFileName = filePath.replaceAll("-", "Ü") || "noFileNameFound";
    // traverse(ast, {
    //   FunctionDeclaration(path) {
    //     if (path.node.id.name) {
    //       let newName = `CBUNAME_${path.node.id.name}_CBUTYPE_FUNCTIONDECLARATION_CARIBU_CBUSTART${path.node.start}_CBUEND${path.node.end}_CBUPATH${newFileName}`
    //       funcDecLibrary[path.node.id.name] = newName
    //       path.node.id.name = `CBUNAME_${path.node.id.name}_CBUTYPE_FUNCTIONDECLARATION_CARIBU_CBUSTART${path.node.start}_CBUEND${path.node.end}_CBUPATH${newFileName}`
    //     }
    //   }
    // })

    // traverse(ast, {
    //   Identifier(path) {
    //     // console.log(path)
    //     if (funcDecLibrary[path.node.name]) {
    //       console.log("PAth Name found")
    //       console.log(path.node.name)
    //       path.node.name = funcDecLibrary[path.node.name]
    //     }
    //   }
    // })

    // console.log("before newCode")
    // console.log(ast)
    // let newCode = generate(
    //   ast,
    //   { sourceMaps: true }
    // );
    // console.log("newCode generated:")
    // console.log(newCode.code)

    //stop the requiring of this every time

    // assign replace the value of using the `arrowToNamed` plugin on the passed in code. Which will return an object of which we only want code for now.
    let replace: string = require("@babel/core").transformSync(code, {
      plugins: [
        [
          declarationToNewDeclaration,
          {
            fileName: filePath,
          },
        ],
        [
          expressionToDeclaration,
          {
            fileName: filePath,
          },
        ],
        [
          arrowToNamed,
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

  const oldDirectoryPathOG: string = copiedServer;
  const newDirectoryPath: string = renamedServer;
  // fs.mkdir(newDirectoryPath, (err) => {
  //   console.log(err);
  // });
  //process the directory recursively
  const processDirectory = (oldDirectoryPath: string) => {
      //if error, give error
    fs.readdir(oldDirectoryPath, (error: any, files: any) => {
      if (error) {
        console.error(`Error reading directory: ${error}`);
        return;
      }

      // make a matching path in the new directory to match that of the old directory
      // this make sure we retain directory structure as we go down its folder trees
      const newDirectorySubPath: string = oldDirectoryPath.replace(
        oldDirectoryPathOG,
        newDirectoryPath
      );

      console.log(newDirectorySubPath);
      //for each file
      files.forEach((fileName: string) => {
        //make its old and new filePaths
        const oldFilePath: string = `${oldDirectoryPath}/${fileName}`;
        const newFilePath: string = `${newDirectorySubPath}/${fileName}`;

        //check info about the file
        fs.stat(oldFilePath, (error: any, stat: any) => {
          //if there's an error, give an error
          if (error) {
            console.error(`Error getting file stats: ${error}`);
            return;
          }
          console.log("before dir Check");
          //if it's a directory (folder) and not a file, then we want to recursively process the files/folders in it
          if (stat.isDirectory()) {
            if (oldFilePath.indexOf('/node_modules') !== -1) {
              console.log(`${oldFilePath} contains '/node_modules' when we have already copied the node modules. Continuing without copying. Location: ${oldFilePath.indexOf('/node_modules')}`)
            } else if (oldFilePath.indexOf('/.git') !== -1) {
              console.log(`${oldFilePath} contains '/.git' when don't want /.git stuff. Continuing without copying. Location: ${oldFilePath.indexOf('/node_modules')}`)
            } else {
              // if (!oldFilePath.indexOf(".git")) {
              console.log(oldFilePath + " is a directory");
              console.log(newFilePath);
              //make a new folder where none exists
              fs.mkdirSync(newFilePath, { recursive: true }, (err) =>
                console.log("error in mkDirSync", err)
              );
              console.log("made this path:", newFilePath);
              //recursively process files
              processDirectory(oldFilePath);
              // }
            }
          }
          //else, if its a js file, then process it
          //THIS IS A BIG BOTTLENECK VVVVV -- if we want to support anything other than js (like .ts, .svelte, etc. this is where we gotta start)
          else if (fileName.endsWith(".js")) {
            console.log("js check hit");
            //get the file
            fs.readFile(oldFilePath, "utf-8", (error: any, code: string) => {
              //if error, give error
              if (error) {
                console.error(`Error reading file: ${error}`);
                return;
              }
              //make a clean filepath for the babel parser
              let cleanFilePath: string = oldFilePath
                .replaceAll("/", "$")
                .replaceAll(".", "_");
                //maybe add umlaut thing
              cleanFilePath = cleanFilePath.slice(1);

              //invoke the transform and give the result to modified code
              const modifiedCode = babelTransform(code, cleanFilePath);

              console.log(
                `writing '${oldFilePath}' to '${newDirectorySubPath}' `
              );
              fs.writeFileSync(newFilePath, modifiedCode, (error: any) => {
                if (error) console.error(`Error writing file: ${error}`);
              });
            });
          }
        });
      });
    });
    // return;
  };

  processDirectory(oldDirectoryPathOG);
  console.log("done processing");
  setTimeout(() => {
    next();
  }, 5000);
};

// renameFuncs()

module.exports = renameFuncs