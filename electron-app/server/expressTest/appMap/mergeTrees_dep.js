const originalTree = require('./originalAppTree.json')
const renamedTree = require('./renamedAppTree.json')
const fs = require('fs')
const parser = require('@babel/parser')
const { parse } = require('@babel/core')

const  _traverse = require('@babel/traverse')
const { isGeneratorFunction } = require('util/types')
const traverse = _traverse.default;

class FuncObject {
  constructor (path, filePath) {
    this.funcName = this.funcLabel(path) || "anonymous"
    this.updates = this.listUpdates(path, filePath)
    this.declares = this.listDeclares(path, filePath)
    this.returns = this.listReturns(path, filePath)
    this.depends = this.listDepends(path, filePath)
    this.location = path.node.loc
  }

  funcLabel (path) {
    // console.log("\n\n\n\n\n\n\n\n\n\n\n*******************\nfincLabelpath.node.id", path)
    return path.node.id?.name || path.node.type
  }

  listUpdates (path, filePath) {
    // defines an array of updated variables
    let updatesArr = []
    // creates an individual object for holding info on each updated variable
    //iterate through the body of the function and find expression statements
    path.node.body.body.forEach(bodyNode => {
      if (bodyNode.type === 'ExpressionStatement') {
        console.log("expressionStatement bodyNode", bodyNode, filePath)
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


function info (tree) {
  console.log('**** TREE.ROUTERS **** {object}')
  console.log(tree)
  console.log('**** TREE.ROUTERS **** [array]')
  console.log(tree.routers)
  console.log('**** TREE.ROUTERS.STACK **** [array]')
  tree.routers.forEach(el => {
    console.log(el)
  })
  console.log('**** TREE.ROUTERS.STACK[i].endpoints{}.stack **** {obj}')
  // tree.routers.forEach(el => {
  //   for (let endpoint in el.endpoints) {
  //     console.log(el.endpoints[endpoint])
  //   }
  // })
  // stack.forEach(el => console.log(el))
}

function isolateNumbers(string) {
  const startIndex = string.indexOf('S') + 5;
  let numbers = '';
  for (let i = startIndex; i < string.length; i++) {
    if (!isNaN(string[i])) {
      numbers += string[i];
    } else {
      break;
    }
  }
  return numbers;
}

function isolatePath (string) {
  const startIndex = string.indexOf('CBUPATH_$')
  let slicedString = string.slice(startIndex+7)
  
  let parsedPath = slicedString.replaceAll('$', '/').replaceAll('_','.')
  return parsedPath
}

// info(originalTree)



// create a function
// it will take the old tree and the new tree
function mergeTrees (oldTree, renamedTree) {
  // iterate through new tree
   //tree (obj)
   //routers (v. bound dispatch) [arr of {obj}]
    for (let routerNum = 0; routerNum < oldTree.routers.length; routerNum++) {
      // console.log(oldTree.routers[routerNum])
      
      for (let endpoint in oldTree.routers[routerNum].endpoints) {
        // console.log(Object.keys(oldTree.routers[routerNum]))
        // console.log("****************************************************************")
        // console.log(oldTree.routers[routerNum].endpoints[endpoint])
        
        //loop through mw
        let currentMw = oldTree.routers[routerNum].endpoints[endpoint]['middlewareChain']
        let matchingMw = renamedTree.routers[routerNum].endpoints[endpoint]['middlewareChain']
        //iterate through ll
        while (currentMw) {
          // currentMw.name = renamedTree.routers[routerNum].endpoints[endpoint]['middlewareChain'].name
          currentMw.name = matchingMw.name
          // console.log("CURRENT MW:",  currentMw)
          // console.log("MATCHING MW:",  matchingMw)
          currentMw.startingPosition = parseInt(isolateNumbers(currentMw.name))
          currentMw.filePath = "." + isolatePath(currentMw.name)
          currentMw.funcInfo = getFuncInfo(currentMw.filePath, currentMw.startingPosition)

          // console.log(currentMw.name)
          // console.log(currentMw.startingPosition)
          // console.log(currentMw.filePath)
          // console.log(currentMw.funcInfo)
          // console.log(currentMw)

          currentMw = currentMw.nextFunc
          matchingMw = matchingMw.nextFunc
          // console.log("****************************************************************")
        }
      }

      // for (let endpointNum = 0; endpointNum < oldTree.routers[routerNum]; endpointNum++) {
      //   console.log(oldTree.routers[routerNum][endpointNum])

      // }
      //endpoints {obj of {obj}}
      //endpoint mwChain {obj / ll}
    }
  
   //
  
  // return the old tree with name properties on its middleware chain nodes
  return oldTree
}

const mergedTree = mergeTrees(originalTree, renamedTree)

function getFuncInfo (filePath, startingIndex) {
  // console.log("filepath in getFuncInfo:" , filePath)
  const code = fs.readFileSync(filePath).toString()
  let funcInfo = null
  const ast = parser.parse(code)
  // console.log(ast)
  traverse(ast, {
    //functions with names 
    FunctionDeclaration(path) {
      // console.log("IN TRAVERSAL")
      // given that I have the info about the function in the AST, how can I access the location and pass it in?
      const start = path.node.loc.start.index;
      // check if the line number of interest is within the start and end lines of the function definition
        if (startingIndex === start) {
          // console.log(`Function Named ${path.node.id.name}` , path.node);
          // stop the traversal once we have found the information we are looking for
          // because we are only interested in the first function definition that matches line number
          let newFuncInfo = new FuncObject(path, filePath)
          // console.log(newFuncInfo);
          funcInfo = newFuncInfo
          // path.stop();
        }
    }
    
  });

  traverse(ast, {
    //functions with names 
    FunctionExpression(path) {
      // console.log("IN TRAVERSAL")
      // given that I have the info about the function in the AST, how can I access the location and pass it in?
      const start = path.node.loc.start.index;
      // check if the line number of interest is within the start and end lines of the function definition
        if (startingIndex === start) {
          // console.log(`Function Named ${path.node.id.name}` , path.node);
          // stop the traversal once we have found the information we are looking for
          // because we are only interested in the first function definition that matches line number
          let newFuncInfo = new FuncObject(path, filePath)
          // console.log(newFuncInfo);
          funcInfo = newFuncInfo
          // path.stop();
        }
    }
    
  });

  traverse(ast, {
    //functions with names 
    ArrowFunctionExpression(path) {
      // console.log("IN TRAVERSAL")
      // given that I have the info about the function in the AST, how can I access the location and pass it in?
      const start = path.node.loc.start.index;
      // check if the line number of interest is within the start and end lines of the function definition
        if (startingIndex === start) {
          // console.log(`Function Named ${path.node.id.name}` , path.node);
          // stop the traversal once we have found the information we are looking for
          // because we are only interested in the first function definition that matches line number
          let newFuncInfo = new FuncObject(path, filePath)
          // console.log(newFuncInfo);
          funcInfo = newFuncInfo
          // path.stop();
        }
    }
    
  });
  console.log(funcInfo)
  return funcInfo
} 

const finalObj = []

// console.log(mergedTree)
// console.log(mergedTree.routers)
mergedTree.routers.forEach(route => {
  // console.log(route.endpoints)
  for (let endpoint in route.endpoints) {
    let routeObj = {}
    //save path to a variable
    let endpointPath = route.endpoints[endpoint].path
  
    //save methods to a variable (may need to fix later for multiple endpoints on single route?)
    let endpointMethod = Object.keys(route.endpoints[endpoint].methods)[0]
  
    // console.log(endpointPath, endpointMethod)
    
    //check if endpoint exists, if not, make it and an array for its methods
    if (!routeObj[endpointPath]) {
      console.log("didnt exist")
      routeObj.routeName = endpointPath
      routeObj.routeMethods = {}
      routeObj.routeMethods[endpointMethod] = {}
    }
    
    // routeObj.routeMethods[endpointMethod] = {}

    //this keeps the mwChain as a linkedList
    // routeObj.routeMethods[endpointMethod].middlewareChain = route.endpoints[endpoint].middlewareChain

    //this will make it into an array
    routeObj.routeMethods[endpointMethod].middlewares = []
    
    let current = route.endpoints[endpoint].middlewareChain
    while (current) {
      routeObj.routeMethods[endpointMethod].middlewares.push(current)
      current = current.nextFunc
    }


    // console.log(route.endpoints[endpoint].middlewareChain)
    finalObj.push(routeObj)
  }
})

// console.log(finalObj)
// console.log(finalObj)
// console.dir(finalObj, {depth : 4})
// console.log(finalObj[0].routeName)
// console.log(finalObj[0].routeMethods)
// // console.log(finalObj[0].routeMethods.delete.middlewares[0])

// console.log('///// FUNC INFO PART OF OBJ /////')
// // funcName: 'getCharacters',
// console.log("funcName:", finalObj[2].routeMethods.get.middlewares[0].funcInfo.funcName)
// // funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
// console.log("funcFile:", finalObj[2].routeMethods.get.middlewares[0].filePath)
// // funcPosition: [6, 40],
// console.log("funcPosition:",finalObj[2].routeMethods.get.middlewares[0].funcInfo.location.start.index, finalObj[0].routeMethods.delete.middlewares[0].funcInfo.location.end.index)

// console.log("funcDef:", finalObj[2].routeMethods.get.middlewares[0].funcString)
// // console.log("funcFile:", finalObj[0].routeMethods.delete.middlewares[0])
// // funcDef: 'lorem ipsum dolor sit amet',

// console.log('///// UPSTREAM DEPENDENCIES PART OF OBJ /////')


// console.log("deps:", finalObj[2].routeMethods.get.middlewares[0].funcInfo)





////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////



// {
//   routers: [
//     {
//       pathRegex: [Object],
//       endpoints: [Object],
//       router: [Object],
//       stack: [Array]
//     },
//     {
//       pathRegex: [Object],
//       endpoints: [Object],
//       router: [Object],
//       stack: [Array]
//     }
//   ],
//   boundDispatchers: [ { path: '/', bd: [Object], methods: [Object], stack: [Array] } ]
// }



// {
//   routeName: '/character',
//   routeMethods: {
//     GET: {
//       middlewares: [{
//         functionInfo: {
//           funcName: 'getCharacters',
//           funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
//           funcPosition: [6, 40],
//           funcDef: 'lorem ipsum dolor sit amet',
//         },
//         deps : {
//           totalUpstreamDeps : 1,
//           totalDownstreamDeps : 1,
//           upstream : [{
//             upVarName : 'getCharacters upvarname1',
//             upVarFile : 'getCharacters upvar filepath1',
//             upVarPosition : [8, 15],
//             upVarDef : 'getCharacters upvarvariable def1',
//             upVarUseInFunc : 'getCharacters upvaruseinfunction1'
//           }],
//           downstream : {
//             dependents: [{
//               dependentFuncName : 'getCharacters dependentfunc1 name',
//               dependentFuncFuke : 'getCharacters dependentfunc1 file path',
//               dependentFuncPosition: [1, 25],
//               dependentFuncDef : 'getCharacters dependentfunc1 definition'
//             }]
//           }
//         }
//       }]
//     },
//     POST: {
//       middlewares: [{
//         functionInfo: {
//           funcName: 'addCharacter',
//           funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
//           funcPosition: [102, 119],
//           funcDef: 'tbh i dont know hehe',
//         },
//         deps : {
//           totalUpstreamDeps : 1,
//           totalDownstreamDeps : 1,
//           upstream : [{
//             upVarName : 'addCharacters upvarname1',
//             upVarFile : 'addCharacters upvar filepath1',
//             upVarPosition : [9, 17],
//             upVarDef : 'addCharacters upvarvariable def1',
//             upVarUseInFunc : 'addCharacters upvaruseinfunction1'
//           }],
//           downstream : {
//             dependents: [{
//               dependentFuncName : 'addCharacters dependentfunc1 name',
//               dependentFuncFuke : 'addCharacters dependentfunc1 file path',
//               dependentFuncPosition: [2, 12],
//               dependentFuncDef : 'addCharacters dependentfunc1 definition'
//             }]
//           }
//         }
//       }]
//     }
//   }
// },
// {
//   routeName: '/species',
//   routeMethods: {
//     GET: {
//       middlewares: [{
//         functionInfo: {
//           funcName: 'getSpecies',
//           funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
//           funcPosition: [6, 40],
//         },
//         deps : {
//           totalUpstreamDeps : 1,
//           totalDownstreamDeps : 1,
//           upstream : [{
//             upVarName : 'getSpecies upvarname1',
//             upVarFile : 'getSpecies upvar filepath1',
//             upVarPosition : [2, 21],
//             upVarDef : 'getSpecies upvarvariable def1',
//             upVarUseInFunc : 'getSpecies upvaruseinfunction1'
//           }],
//           downstream : {
//             dependents: [{
//               dependentFuncName : 'getSpecies dependentfunc1 name',
//               dependentFuncFuke : 'getSpecies dependentfunc1 file path',
//               dependentFuncPosition: [3, 7],
//               dependentFuncDef : 'getSpecies dependentfunc1 definition'
//             }]
//           }
//         }
//       }]
//     }
//   }
// },
// {
//   routeName: '/planets',
//   routeMethods: {
//     GET: {
//       middlewares: [{
//         functionInfo: {
//           funcName: 'getPlanets',
//           funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
//           funcPosition: [2, 15],
//         },
//         deps : {
//           totalUpstreamDeps : 1,
//           totalDownstreamDeps : 1,
//           upstream : [{
//             upVarName : 'getPlanets upvarname1',
//             upVarFile : 'getPlanets upvar filepath1',
//             upVarPosition : [5, 19],
//             upVarDef : 'getPlanets upvarvariable def1',
//             upVarUseInFunc : 'getPlanets upvaruseinfunction1'
//           }],
//           downstream : {
//             dependents: [{
//               dependentFuncName : 'getPlanets dependentfunc1 name',
//               dependentFuncFuke : 'getPlanets dependentfunc1 file path',
//               dependentFuncPosition: [7, 12],
//               dependentFuncDef : 'getPlanets dependentfunc1 definition'
//             }]
//           }
//         }
//       }]
//     },
//     POST: {
//       middlewares: [{
//         functionInfo: {
//           funcName: 'addPlanet',
//           funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
//           funcPosition: [12, 32],
//         },
//         deps : {
//           totalUpstreamDeps : 1,
//           totalDownstreamDeps : 1,
//           upstream : [{
//             upVarName : 'addPlanet upvarname1',
//             upVarFile : 'addPlanet upvar filepath1',
//             upVarPosition : [5, 19],
//             upVarDef : 'addPlanet upvarvariable def1',
//             upVarUseInFunc : 'addPlanet upvaruseinfunction1'
//           }],
//           downstream : {
//             dependents: [{
//               dependentFuncName : 'addPlanet dependentfunc1 name',
//               dependentFuncFuke : 'addPlanet dependentfunc1 file path',
//               dependentFuncPosition: [7, 12],
//               dependentFuncDef : 'addPlanet dependentfunc1 definition'
//             }]
//           }
//         }
//       }]
//     },
//     DELETE: {
//       middlewares: [{
//         functionInfo: {
//           funcName: 'deletePlanet',
//           funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
//           funcPosition: [33, 42],
//         },
//         deps : {
//           totalUpstreamDeps : 1,
//           totalDownstreamDeps : 1,
//           upstream : [{
//             upVarName : 'deletePlanet upvarname1',
//             upVarFile : 'deletePlanet upvar filepath1',
//             upVarPosition : [5, 19],
//             upVarDef : 'deletePlanet upvarvariable def1',
//             upVarUseInFunc : 'deletePlanet upvaruseinfunction1'
//           }],
//           downstream : {
//             dependents: [{
//               dependentFuncName : 'deletePlanet dependentfunc1 name',
//               dependentFuncFuke : 'deletePlanet dependentfunc1 file path',
//               dependentFuncPosition: [7, 12],
//               dependentFuncDef : 'deletePlanet dependentfunc1 definition'
//             }]
//           }
//         }
//       }]
//     }
//   }
// }