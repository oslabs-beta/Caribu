const { parse } = require("@babel/core");
const fs = require("fs");
// const path = require("path");

const myCode = fs.readFileSync("./justinsExSWAPI.js").toString();
const myAST = parse(myCode);
