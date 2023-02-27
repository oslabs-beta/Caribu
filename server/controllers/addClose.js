var fs = require('fs');
var parser = require('@babel/parser');
// const { babel, parse } = require('@babel/core')
var generate = require("@babel/generator")["default"];
var traverse = require("@babel/traverse")["default"];
var t = require("@babel/types");
var addCloseExport = function (req, res, next) {
    console.log("INN ADD CLOSE EXPORT");
    var copiedServerApp = fs.readFileSync('./process/copiedServer/server.js').toString();
    // console.log(copiedServerApp)
    var ast = parser.parse(copiedServerApp);
    var appObjName = null;
    traverse(ast, {
        CallExpression: function (path) {
            var _a, _b, _c, _d, _e, _f;
            if (path.parent.type === 'VariableDeclarator' &&
                ((_c = (_b = (_a = path === null || path === void 0 ? void 0 : path.parent) === null || _a === void 0 ? void 0 : _a.init) === null || _b === void 0 ? void 0 : _b.callee) === null || _c === void 0 ? void 0 : _c.name) === 'express' || ((_f = (_e = (_d = path === null || path === void 0 ? void 0 : path.parent) === null || _d === void 0 ? void 0 : _d.init) === null || _e === void 0 ? void 0 : _e.callee) === null || _f === void 0 ? void 0 : _f.name) === 'Express') {
                // console.log(path.parent)
                appObjName = path.parent.id.name;
                // console.log(appObjName)
            }
        }
    });
    var closeAppOnce = true;
    traverse(ast, {
        CallExpression: function (path) {
            if (path.node.callee.type === "MemberExpression" &&
                path.node.callee.property.name === "listen" &&
                closeAppOnce) {
                path.parent ? console.log("parent exists") : console.log("no parent exists");
                console.log("PATH:");
                // console.log(path)
                console.log("PATH.NODE:");
                console.log(path);
                path.replaceWith(t.callExpression(t.memberExpression(t.callExpression(path.node.callee, path.node.arguments), t.identifier('close')), []));
                closeAppOnce = false;
                // console.log("PATH.PARENT:")
                // console.log(path.parentPath)
                // path.insertAfter(
                //   t.expressionStatement(
                //     t.callExpression(
                //       t.memberExpression(t.identifier(appObjName), t.identifier("close")),
                //       []
                //     )
                //   )
                // );
            }
        }
    });
    //add module.exports = app to the end of the file
    traverse(ast, {
        Program: function (path) {
            // Create a new statement that exports the variable `myVar`
            var exportStatement = t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier("module"), t.identifier("exports")), t.identifier(appObjName)));
            // Append the new statement to the end of the program
            path.pushContainer("body", exportStatement);
        }
    });
    var code = generate(ast
    // { sourceMaps: true }
    ).code;
    // console.log(code)
    fs.writeFileSync('./process/copiedServer/server.js', code);
    next();
};
// const res = {
//   locals : {
//     tree : null
//   }
// }
// const next = () => {}
// addCloseExport(null, null, next)
module.exports = addCloseExport;
