const fs = require('fs')

const parser = require('@babel/parser')
// const { babel, parse } = require('@babel/core')
const generate = require("@babel/generator").default;

const traverse = require("@babel/traverse").default;

const t = require("@babel/types");

const addCloseExport = (req, res, next) => {
  console.log("INN ADD CLOSE EXPORT")
  const copiedServer = "./process/copiedServer";
  console.log("serverPath: ", req.body.serverpath)
  console.log(req.body.serverpath.replace(req.body.filepath, copiedServer))
  let copiedServerApp = req.body.serverpath.replace(req.body.filepath, copiedServer)
  console.log(copiedServerApp)
  const codeToParse = fs.readFileSync(copiedServerApp).toString()
  // console.log(copiedServerApp)
  
  const ast = parser.parse(codeToParse)

  let appObjName = null
  traverse(ast, {
    CallExpression(path) {
      if (
        path.parent.type === 'VariableDeclarator' &&
        path?.parent?.init?.callee?.name === 'express' || path?.parent?.init?.callee?.name === 'Express'
        ) {
          // console.log(path.parent)
          appObjName = path.parent.id.name
          // console.log(appObjName)
      }
    },
  });

  
  
  let closeAppOnce = true 
  
  traverse(ast, {
    CallExpression(path) {
      if (
        path.node.callee.type === "MemberExpression" &&
        path.node.callee.property.name === "listen" &&
        closeAppOnce
      ) {
        path.parent ? console.log("parent exists") : console.log("no parent exists")
        console.log("PATH:")
        // console.log(path)
        console.log("PATH.NODE:")
        console.log(path)

        path.replaceWith(
          t.callExpression(
            t.memberExpression(
              t.callExpression(path.node.callee, path.node.arguments),
              t.identifier('close')
            ),
            []
          )
        );
        closeAppOnce = false
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
    },
  });
  

  //add module.exports = app to the end of the file
  traverse(ast, {
    Program(path) {
      // Create a new statement that exports the variable `myVar`
      const exportStatement = t.expressionStatement(
        t.assignmentExpression(
          "=",
          t.memberExpression(
            t.identifier("module"),
            t.identifier("exports")
          ),
          t.identifier(appObjName)
        )
      );
  
      // Append the new statement to the end of the program
      path.pushContainer("body", exportStatement);
    },
  });
  
  



  const { code } = generate(
    ast
    // { sourceMaps: true }
  );
  
  console.log(code)

  fs.writeFileSync(copiedServerApp, code)
  next()
}

// const res = {
//   locals : {
//     tree : null
//   }
// }

// const next = () => {}
// addCloseExport(null, null, next)

module.exports = addCloseExport