const path = require("path");

module.exports = {
  processFolder: path.join(__dirname, "../process/"),
  node_modules: path.join(__dirname, "../process/node_modules"),
  copiedServer: path.join(__dirname, "../process/copiedServer"),
  renamedServer: path.join(__dirname, "../process/renamedServer"),
  appTreeFolder: path.join(__dirname, "../process/appTrees"),
};
