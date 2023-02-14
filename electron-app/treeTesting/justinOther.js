const babel = require("@babel/core");
const fs = require("fs");
// const path = require("path");

const myCode = fs.readFileSync("./justinsExSWAPI.js").toString();

const getVariablesReferencedInFunction = (ast, startLine, endLine) => {
  let referencedVariables = [];
  babel.traverse(ast, {
    VariableDeclaration(path) {
      const line = path.node.loc.start.line;
      if (line >= startLine && line <= endLine) {
        const variableName = path.node.declarations[0].id.name;
        referencedVariables.push(variableName);
      }
    },
    Identifier(path) {
      const line = path.node.loc.start.line;
      if (line >= startLine && line <= endLine) {
        const identifierName = path.node.name;
        const ignore = ["console", "log", "json", "data", "then", "fetch"];
        if (
          !referencedVariables.includes(identifierName) &&
          !ignore.includes(identifierName)
        ) {
          referencedVariables.push(identifierName);
        }
      }
    },
  });
  return referencedVariables;
};

const { ast } = babel.transformSync(myCode, {
  ast: true,
  code: false,
});

const startLine = 31;
const endLine = 45;
const variablesReferencedInFunction = getVariablesReferencedInFunction(
  ast,
  startLine,
  endLine
);
console.log(variablesReferencedInFunction);

// gets all functions names, not helpful at all
const getFunctionNames = (ast) => {
  const functionNames = [];

  babel.traverse(ast, {
    FunctionDeclaration(path) {
      console.log(path);
      functionNames.push(path.node.id.name);
    },
    FunctionExpression(path) {
      if (path.parentPath.isVariableDeclarator()) {
        console.log(path.parentPath.node.id.name);
        functionNames.push(path.parentPath.node.id.name);
      } else {
        // doesnt work
        functionNames.push("anonymous");
      }
    },
  });

  return functionNames;
};

const functionNames = getFunctionNames(ast);
console.log(functionNames);
