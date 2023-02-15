const acorn = require("acorn");
const walk = require("acorn-walk");
const fs = require("fs");

let counter = 0;
// babel modules
const parser = require('@babel/parser')

// const { default } = generate
// this is some weird require vs. import thing.
// see https://github.com/babel/babel/issues/13855
const  _traverse = require('@babel/traverse')
const traverse = _traverse.default;
// 
// const { types: t } = require("@babel/core");


const babelTransform = (code, filePath) => {
  const generate = require('@babel/generator').default
  let ast = parser.parse(code)
  // console.log(ast)
  // return ast
  // console.log('************')
  // // let transformedObj = babel.transformSync(code, {



  ////////////////////////////////////////////////////////////

  let replace = require("@babel/core").transformSync(code, {
    plugins: [["./arrowToNamed", {
        "fileName": filePath
    }]],
    comments : true,
    retainLines : true,
    // plugins: ["@babel/plugin-transform-arrow-functions"],
  });

  // console.log(replace)
  return replace.code

  ////////////////////////////////////////////////////////////

  // traverse(ast, {
  //   ArrowFunctionExpression(path, file) {
  //     console.log(state)
  //     // console.log(path.parent)
  //     // console.log(path.hub)
  //     // console.log(path.contexts)
  //     // convert arrow function to a named function expression
  //     // const func = t.functionExpression(
  //     //   t.identifier(`named_${path.node.start}_${path.node.end}`),
  //     //   path.node.params,
  //     //   path.node.body,
  //     //   path.node.generator,
  //     //   path.node.async
  //     // );

  //     // path.replaceWith(func);
  //   }
  // })

  // // const plugReturn = generate(ast)
  // // // console.log(toReturn)
  // // return plugReturn.code



  // // })
  // // console.log(transformedObj)
  // // console.log(code)

  // // console.log(ast)
  // // console.log("hi this is an ast")
  // //find just refular function declarations
  // // traverse(ast, {
  // //   ArrowFunctionExpression(path) {
  // //     // console.log("*************************************************************************************************")
  // //     // console.log(path.node.id)
  // //     if (!path.node.id) {
  // //       path.node.id = {
  // //         type: "Identifier",
  // //         name: `CARIBU_${filePath}_${path.node.start}_${path.node.end}_anonymous`
  // //       }
  // //     } else {
  // //       path.id = `${path.node.id.name}_CARIBU_${oldFilePath}_${path.node.start}_${path.node.end}`
  // //     }
  // //     // console.log(path.node.id)
  // //   },
  // // });

  // // traverse(ast, {
  // //   ArrowFunctionExpression(path) {
  // //     console.log("*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************")
  // //     console.log(path.node.id)
  // //   },
  // // });
  // // // console.log(generate)
  // // const toReturn = generate(ast)
  // // // console.log(toReturn)
  // // return toReturn.code



}


// const acornTransform = (code, filePath) => {
  //  const { generate } = require('astring')
//   let ast = acorn.parse(code);

//   walk.simple(ast, {
//     FunctionExpression: function(node) {
//       console.log(node)
//       if (!node.id) {
//         // console.log(node)
//         node.id = {
//           type: "Identifier",
//           name: `CARIBU_${filePath}_${node.start}_${node.end}_anonymous`
//         };
//       } else {
//         node.id.name = `${node.id.name}_CARIBU_${filePath}_${node.start}_${node.end}`
//       }
//     }
//   });

//   walk.simple(ast, {
//     ArrowFunctionExpression: function(node) {
//       // let toRegen = node
//       // require("@babel/core").transformSync(to, {
//       //   plugins: ["@babel/plugin-transform-arrow-functions"],
//       // });
      

//       console.log(node)
//       if (!node.id) {
//         // console.log(node)
//         node.id = {
//           type: "Identifier",
//           name: `CARIBU_${filePath}_${node.start}_${node.end}_anonymous`
//         };
//       } else {
//         node.id.name = `${node.id.name}_CARIBU_${filePath}_${node.start}_${node.end}`
//       }
//     }
//   });
//   console.log("inAddNames")
//   return generate(ast);
// };




// const addNamesToAnonymousFunctions = (code, oldFilePath) => {
//   let ast = acorn.parse(code);

//   walk.simple(ast, {
//     FunctionExpression: function(node) {
//       console.log(node)
//       if (!node.id) {
//         console.log(node)
//         node.id = {
//           type: "Identifier",
//           name: `CARIBU_${oldFilePath}_${node.start}_${node.end}_anonymous`
//         };
//       } else {
//         node.id.name = `${node.id.name}_CARIBU_${oldFilePath}_${node.start}_${node.end}`
//       }
//     }
//   });
//   console.log("inAddNames")
//   return generate(ast);
  
// };

const oldDirectoryPathOG = "../copiedServer";
const newDirectoryPath = "../copiedServerNamed";

const processDirectory = oldDirectoryPath => {
  console.log("in ", oldDirectoryPath)
  fs.readdir(oldDirectoryPath, (error, files) => {
    if (error) {
      console.error(`Error reading directory: ${error}`);
      return;
    }
  const newDirectorySubPath = oldDirectoryPath.replace(oldDirectoryPathOG, newDirectoryPath)
  console.log(newDirectorySubPath)
    files.forEach(fileName => {
      console.log(fileName)
      const oldFilePath = `${oldDirectoryPath}/${fileName}`;
      const newFilePath = `${newDirectorySubPath}/${fileName}`
      fs.stat(oldFilePath, (error, stat) => {
        if (error) {
          console.error(`Error getting file stats: ${error}`);
          return;
        }

        if (stat.isDirectory()) {
          console.log(oldFilePath + " is a directory")
          console.log(newFilePath)
          fs.mkdirSync(newFilePath)
          processDirectory(oldFilePath);
        } else if (fileName.endsWith(".js")) {
          fs.readFile(oldFilePath, "utf-8", (error, code) => {
            if (error) {
              console.error(`Error reading file: ${error}`);
              return;
            }
            let cleanFilePath = oldFilePath.replaceAll("/", '$').replaceAll(".", '_')
            cleanFilePath = cleanFilePath.slice(1)
            // const modifiedCode = addNamesToAnonymousFunctions(code, cleanFilePath);
            const modifiedCode = babelTransform(code, cleanFilePath);
            // console.log(modifiedCode)
            console.log(`writing '${oldFilePath}' to '${newDirectorySubPath}' `)
            fs.writeFile(newFilePath, modifiedCode, error => {
              if (error) console.error(`Error writing file: ${error}`);
            });
          });
        }
      });
    });
  });
};

processDirectory(oldDirectoryPathOG)
