const { parse } = require("@babel/parser");
// const { traverse } = require("@babel/core");
// const { colors, log } = require("mercedlogger");
const fs = require("fs");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
// const escope = require("escope");

<<<<<<< HEAD
const myCode = fs.readFileSync("./justinsExSWAPI.js").toString();
=======
const myCode = fs.readFileSync("/Users/morry/git/Caribu/electron-app/treeTesting/justinsExSWAPI.js").toString();
>>>>>>> 604a7b9b53c838643bee110512858ce05166d7b3
// console.log(myCode);
const myAST = parse(myCode);

// console.log(myAST);

const myBody = myAST.program.body;

const variables = {};

for (let i = 0; i < myBody.length; i++) {
  //   console.log(myBody[i].type === "VariableDeclaration");
  if (myBody[i].type === "VariableDeclaration") {
    // variables.push(myBody[i].declarations[0].id.name);
    variables[myBody[i].declarations[0].id.name] = [];
  }
}
// traverse(myAST, {
//   enter(path) {
//     const testBindings = path.scope.getBinding("testNum");
//     console.log(testBindings);
//   },
// });

<<<<<<< HEAD
const globalVariables = {};
=======
const globalVariables = new Set();
>>>>>>> 604a7b9b53c838643bee110512858ce05166d7b3

traverse(myAST, {
  VariableDeclaration(path) {
    path.node.declarations.forEach((declaration) => {
<<<<<<< HEAD
      globalVariables[declaration.id.name] = [];
=======
      globalVariables.add(declaration.id.name);
>>>>>>> 604a7b9b53c838643bee110512858ce05166d7b3
    });
  },

  Identifier(path) {
    const node = path.node;
<<<<<<< HEAD
    // console.log(node);
    // if (globalVariables.has(node.name)) {
    //   log.magenta(
    //     `Reference to global variable ${node.name} at line`,
    //     `${node.loc.start.line}`
    //   );
    // }
    if (globalVariables[node.name]) {
      // console.log(globalVariables[node.name]);
      globalVariables[node.name].push(node.loc.start.line);
    }
  },
});
console.log(globalVariables);
// for (const key in globalVariables) {
//   console.log(key);
// }
=======
    if (globalVariables.has(node.name)) {
      log.cyan(
        `Reference to global variable ${node.name} at line`,
        `${node.loc.start.line}`
      );
    }
  },
});
>>>>>>> 604a7b9b53c838643bee110512858ce05166d7b3

// Finds where variable is referenced and prints what function it is referenced in. Prints null when it is an anon function for some reason its not going into while block

const targetVariableName = "testNum";

traverse(myAST, {
  Identifier(path) {
    if (path.node.name === targetVariableName) {
      let functionName = null;
      let parent = path.parentPath;
      while (parent) {
<<<<<<< HEAD
        // console.log(t.isArrowFunctionExpression(parent.node));
=======
      // log.magenta("in while loop with this parentNode:" , parent)
>>>>>>> 604a7b9b53c838643bee110512858ce05166d7b3
        if (
          t.isFunctionDeclaration(parent.node) ||
          t.isFunctionExpression(parent.node)
        ) {
          // console.log(parent.node);
          functionName = parent.node.id ? parent.node.id.name : "anonymous";
          break;
        }
        parent = parent.parentPath;
      }
<<<<<<< HEAD
=======
      if (!functionName) console.log(`Reference to ${targetVariableName} found in function anonymous function. Node:`, path.node)

>>>>>>> 604a7b9b53c838643bee110512858ce05166d7b3
      console.log(
        `Reference to ${targetVariableName} found in function ${functionName}. Node:`,
        path.node
      );
    }
  },
});

// given a functions start and end location, find out what variables are referenced as well a list of functions that those variables are referenced in other functions 😮‍💨

// for (const key in globalVariables) {
//   traverse(myAST, {
//     Identifier(path) {
//       if (path.node.name === key) {
//         let functionName = null;
//         let parent = path.parentPath;
//         while (parent) {
//           // console.log(t.isFunctionDeclaration(parent.node));
//           console.log(t.isFunctionExpression(parent.node));
//           if (
//             t.isFunctionDeclaration(parent.node) ||
//             t.isFunctionExpression(parent.node)
//           ) {
//             // console.log(parent.node);
//             functionName = parent.node.id ? parent.node.id.name : "anonymous";
//             break;
//           }
//           parent = parent.parentPath;
//         }
//         // console.log(
//         //   `Reference to ${key} found in function ${functionName} and its node: ${path.node}`
//         // );
//       }
//     },
//   });
// }
