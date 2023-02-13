// general modules
const fs = require('fs')

// babel modules
const parser = require('@babel/parser')
// this is some weird require vs. import thing.
// see https://github.com/babel/babel/issues/13855
const  _traverse = require('@babel/traverse')
const traverse = _traverse.default;

// read the given file and convert it to a string
const code = fs.readFileSync('/Users/morry/git/Caribu/electron-app/treeTesting/morryExampleSWAPI.js').toString()

// parse it to an AST
// we will probably have to add an {options object with a bucnh of [plugins in an array]} later as a second argument for stuff like TS/flow/other stuff
const ast = parser.parse(code)


//THIS FUNC LISTS ALL DECLARED VARIBALES IN THE AST
// traverse(ast, {
//   VariableDeclaration(path) {
//     // console.log(Object.keys(path))
//     // console.log(path.node.declarations)
//     console.log("*************************************************************************************************")
//     for (dec of path.node.declarations) {
//       console.log(dec.id.name)
//     }
//     // console.log(path.scope)
//   }
// })


class FuncObject {
  constructor (path) {
    this.funcName = this.funcLabel(path) || "anonymous"
    this.updates = this.listUpdates(path)
    this.declares = this.listDeclares(path)
    this.returns = this.listReturns(path)
    this.depends = this.listDepends(path)
    this.location = path.node.loc
  }

  funcLabel (path) {
    // console.log("\n\n\n\n\n\n\n\n\n\n\n*******************\nfincLabelpath.node.id", path)
    return path.node.id?.name || path.node.type
  }

  listUpdates (path) {
    // defines an array of updated variables
    let updatesArr = []
    // creates an individual object for holding info on each updated variable
    //iterate through the body of the function and find expression statements
    path.node.body.body.forEach(bodyNode => {
      if (bodyNode.type === 'ExpressionStatement') {
        // console.log(path)
        let indivUpdateObj = {}
        indivUpdateObj.typeOfExpression = bodyNode.expression.type
        // console.log(bodyNode)
        if (bodyNode.expression.type = 'AssignmentExpression') {
          // console.log(bodyNode.expression)
          //it is either a direcgt update
          //which means it has NO left or right
          if (!bodyNode.expression.left) {
            indivUpdateObj.varName = bodyNode.expression.argument?.loc?.identifierName
          } else {
            //or it is an assignment 
  
            // console.log(bodyNode.expression.left?.object?.name + "." + bodyNode.expression.left.property.name)
            indivUpdateObj.varName = bodyNode.expression.left.object.name + "." + bodyNode.expression.left.property.name
            updatesArr.push(indivUpdateObj)

          }
        }
        // if (bodyNode.expression.type = 'UpdateExpression') {
        //   indivUpdateObj.varName = bodyNode.expression.argument?.loc?.identifierName
        // }
        // let indivUpdateObj = {}
        // get teh type of expression 
        
        // get the name of the var it acts on 
        // need the OR because .loc.identifierName only works on direct mutations (I think) for example: testNum++
        // indivUpdateObj.varName = bodyNode.expression.argument?.loc?.identifierName
        updatesArr.push(indivUpdateObj)
      }
    })
    return updatesArr
  }


  listDeclares (path) {
    let declaresArr = []
    //bindings things that the functions *creates*/*declares* and binds values to? ie: parameters for the args that get passed in and vars named in the func
    //these are all in a convenient object, so we can just iterate through it
    for (const binding in path.scope.bindings) {
      let indivDeclareObj = {}
      indivDeclareObj.varName = path.scope.bindings[binding].identifier.name
      declaresArr.push(indivDeclareObj)
    }
    return declaresArr
  }

  listDepends (path) {
    const funcName = this.funcName
    // console.log(this.declares)
    // let simpleDeclares = this.declares.reduce((acc, curr) => {acc.push(curr.varName)}, [])
    let simpleDeclares = []
    this.declares.forEach(el => {
      // console.log(el)
      simpleDeclares.push(el.varName)
    })
    // console.log(simpleDeclares)
    let dependsList = []
    path.traverse({
      Identifier(path) {
        // console.log("listDepends")indivUpdateObj.varName = bodyNode.expression.argument?.loc?.identifierName
        // console.log(`Identifier found: ${path.node.name}`);
        if (simpleDeclares.includes(path.node.name) || path.node.name == funcName) {
          // console.log(`${path.node.name} is an INTERNAL variable`)
        } else {
          // console.log(`${path.node.name} is an EXTERNAL variable`)
          dependsList.push(path.node.name)
        }
      }
    })
    return dependsList
  }

  listReturns (path) {
    let returnVal = []
    //each func has a return statement (potentially more than 1)
    //this will need to be updated to better handle the case of multiple returns (eg. conditional returns) later
    path.node.body.body.forEach(bodyNode => {
      if (bodyNode.type === 'ReturnStatement') {
        returnVal.push(bodyNode.argument.name)
      }
    })
    return returnVal
  }
}

console.log('******************************************************** NEW RUN ********************************************************')

//travserse and 
traverse(ast, {
  FunctionDeclaration(path) {
    // console.log("*************************************************************************************************")
    let newFuncInfo = new FuncObject(path)
    console.log(newFuncInfo)

  },
});

traverse(ast, {
  FunctionExpression(path) {
    // console.log("*************************************************************************************************")
    let newFuncInfo = new FuncObject(path)
    console.log(newFuncInfo)

  },
});

traverse(ast, {
  ArrowFunctionExpression(path) {
    // console.log("*************************************************************************************************")
    let newFuncInfo = new FuncObject(path)
    console.log(newFuncInfo)

  },
});




// const scan = require('scope-analyzer')



// method definition (outside of obj or class itslef)
// an assignment expression
// that assigns a member expression
// either an arrow function expression
// or something else, but we can worry abt that later
// a method is a MemberExpression that is assigned a function

// traverse(ast, {
//   ExpressionStatement(path) {
//     console.log("************************************************************************************************************************************")
//     console.log(path)
//     // console.log(path.container.right)
//   }
// })

// console.log(ast.program)


// traverse(ast, {
//   VariableDeclaration(path) { 
//     // console.log("hi")
//     if (path.parentPath.isProgram()) {
//         console.log("************************************************************************************************************************************")
//         // console.log(path)
//         console.log(path.node)
        
//         // console.log("******traversalcontext.scope****************************************************")
//         // console.log(path.contexts[0].scope)
//       }

//     }
//   }
// )

// ast.program.body.forEach(node => {
//   if (node.type === 'VariableDeclaration') {
//     // console.log("Expression Statement")
//     console.log(node)
//   }
// })


// ast.program.body.forEach(node => {
//   if (node.type === 'ExpressionStatement') {
//     console.log("Expression Statement")
//     console.log(node)
//   }
// })

// ast.program.body.forEach(node => {
//   if (node.type === 'FunctionDeclaration') {
//     console.log("Function Declaration")
//     console.log(node)
//   }
// })









// for (const node in ast.program.body) {
//   // console.log(node)
//   if (node.type === 'ExpressionStatement') {
//     console.log("hi")
//   }
// }

////// print the full source code of a fgiven node
// const { parse } = require('@babel/parser');

// const source = '1 + 2 + 3';
// const ast = parse(source);
// const node = ast.program.body[0].expression.left;

// console.log(source.slice(node.start, node.end)); // → '1 + 2'


// useful funcs we'd want:
// 1. Given a var at a position, find where it is defined upstream and what acts on it everywhere
// 


// const nonReferenceIdentifiers = [
//   'FunctionDeclaration',
//   'FunctionExpression',
//   'ClassMethod',
//   'LabeledStatement',
//   'BreakStatement',
//   'ContinueStatement',
//   'CatchClause',
//   'ArrayPatten',
//   'RestElement'
// ]

// module.exports = { findGlobals }

// function findGlobals (ast) {
//   const globals = new Map()
//   traverse(ast, {
//     // ReferencedIdentifier
//     Identifier: (path) => {
//       // skip if not being used as reference
//       const parentType = path.parent.type
//       if (nonReferenceIdentifiers.includes(parentType)) return
//       if (parentType === 'VariableDeclarator' && path.parent.id === path.node) return
//       // skip if this is the key side of a member expression
//       if (parentType === 'MemberExpression' && path.parent.property === path.node) return
//       // skip if this is the key side of an object pattern
//       if (parentType === 'ObjectProperty' && path.parent.key === path.node) return
      
//       // skip if it refers to an existing variable
//       const name = path.node.name
//       if (path.scope.hasBinding(name, true)) return
      
//       // check if arguments refers to a var, this shouldn't happen in strict mode
//       if (name === 'arguments') {
//         if (isInFunctionDeclaration(path)) return
//       }

//       // save global
//       saveGlobal(path)
//     },
//     ThisExpression: (path) => {
//       if (isInFunctionDeclaration(path)) return
//       saveGlobal(path, 'this')
//     }
//   })

//   return globals

//   function saveGlobal (path, name = path.node.name) {
//     // init entry if needed
//     if (!globals.has(name)) {
//       globals.set(name, [])
//     }
//     // append ref
//     const refsForName = globals.get(name)
//     refsForName.push(path)
//   }
// }

// function isInFunctionDeclaration (path) {
//   return getParents(path.parentPath).some(parent => parent.type === 'FunctionDeclaration')
// }

// function getParents (nodePath) {
//   const parents = []
//   let target = nodePath
//   while (target) {
//     parents.push(target.node)
//     target = target.parentPath
//   }
//   parents.reverse()
//   return parents
// }

// const globals = findGlobals(ast)

// console.log(globals)
// console.log(ast)

// if val > this.val, val = right

// check greater than or less than
// if less, go left, if more, go right
//
