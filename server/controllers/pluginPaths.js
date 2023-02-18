const path = require("path");

module.exports = {
  arrowToNamed: path.join(__dirname, "./plugins/arrowToNamed.js"),
  declarationToNewDeclaration: path.join(__dirname, "./plugins/declarationToNewDeclaration.js"),
  expressionToDeclaration: path.join(__dirname, "./plugins/expressionToDeclaration.js"),
};
