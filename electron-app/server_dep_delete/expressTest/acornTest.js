const acorn = require("acorn");
const walk = require("acorn-walk");
const fs = require("fs");
const { generate } = require('astring')
let counter = 0;

const addNamesToAnonymousFunctions = (code, filePath) => {
  let ast = acorn.parse(code);

  walk.simple(ast, {
    FunctionExpression: function(node) {
      console.log(node)
      if (!node.id) {
        // console.log(node)
        node.id = {
          type: "Identifier",
          name: `CARIBU_${filePath}_${node.start}_${node.end}_anonymous`
        };
      } else {
        node.id.name = `${node.id.name}_CARIBU_${filePath}_${node.start}_${node.end}`
      }
    }
  });
  console.log("inAddNames")
  return generate(ast);
};

const directoryPath = "./serverReset";

const processDirectory = directoryPath => {
  fs.readdir(directoryPath, (error, files) => {
    if (error) {
      console.error(`Error reading directory: ${error}`);
      return;
    }

    files.forEach(fileName => {
      const filePath = `${directoryPath}/${fileName}`;

      fs.stat(filePath, (error, stat) => {
        if (error) {
          console.error(`Error getting file stats: ${error}`);
          return;
        }

        if (stat.isDirectory()) {
          processDirectory(filePath);
        } else if (fileName.endsWith(".js")) {
          fs.readFile(filePath, "utf-8", (error, code) => {
            if (error) {
              console.error(`Error reading file: ${error}`);
              return;
            }
            let cleanFilePath = filePath.replace("/", '-')
            cleanFilePath = cleanFilePath.slice(1)
            const modifiedCode = addNamesToAnonymousFunctions(code, cleanFilePath);

            fs.writeFile(filePath, modifiedCode, error => {
              if (error) console.error(`Error writing file: ${error}`);
            });
          });
        }
      });
    });
  });
};

processDirectory(directoryPath)
