const { parse } = require("@babel/parser");
// const { traverse } = require("@babel/core");
const { colors, log } = require("mercedlogger");
const fs = require("fs");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
// const escope = require("escope");

const myCode = fs.readFileSync("./exampleSWAPIAST.js").toString();
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

// const globalVariables = new Set();

// traverse(myAST, {
//   VariableDeclaration(path) {
//     path.node.declarations.forEach((declaration) => {
//       globalVariables.add(declaration.id.name);
//     });
//   },

//   Identifier(path) {
//     const node = path.node;
//     if (globalVariables.has(node.name)) {
//       log.cyan(
//         `Reference to global variable ${node.name} at line`,
//         `${node.loc.start.line}`
//       );
//     }
//   },
// });

// Finds where variable is referenced and prints what function it is referenced in. Prints null when it is an anon function for some reason its not going into while block

const targetVariableName = "testNum";

traverse(myAST, {
  Identifier(path) {
    if (path.node.name === targetVariableName) {
      let functionName = null;
      let parent = path.parentPath;

      while (parent) {
        if (
          t.isFunctionDeclaration(parent.node) ||
          t.isFunctionExpression(parent.node)
        ) {
          console.log(parent.node.id.name);
          console.log(null);
          functionName = parent.node.id ? parent.node.id.name : "anonymous";
          break;
        }
        parent = parent.parentPath;
      }

      console.log(
        `Reference to ${targetVariableName} found in function ${functionName}. Node:`,
        path.node
      );
    }
  },
});
