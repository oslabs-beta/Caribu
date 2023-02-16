"use strict";
const originalTree = require('./originalAppTree.json');
const renamedTree = require('./renamedAppTree.json');
const fs = require('fs');
const parser = require('@babel/parser');
const { parse } = require('@babel/core');
const _traverse = require('@babel/traverse');
const { isGeneratorFunction } = require('util/types');
const traverse = _traverse.default;
//declare a class for funcObject which we will use to make/store info about mw functions we find
class FuncObject {
    constructor(path) {
        this.funcName = this.funcLabel(path) || "anonymous";
        this.updates = this.listUpdates(path);
        this.declares = this.listDeclares(path);
        this.returns = this.listReturns(path);
        this.depends = this.listDepends(path);
        this.location = path.node.loc;
    }
    //makes the function's name / label
    funcLabel(path) {
        var _a;
        // console.log("\n\n\n\n\n\n\n\n\n\n\n*******************\nfincLabelpath.node.id", path)
        return ((_a = path.node.id) === null || _a === void 0 ? void 0 : _a.name) || path.node.type;
    }
    //gets a list all of the variables the function updates
    // **** NEED TO FIX THIS FUNCTIONALITY TO MAKE MORE PRECISE INFO AS NEEDED FOR FRONTEND OBJECT******
    listUpdates(path) {
        // defines an array of updated variables
        let updatesArr = [];
        // creates an individual object for holding info on each updated variable
        // iterate through the body of the function and finds expression statements (stuff that updates/assigns/changes)
        path.node.body.body.forEach((bodyNode) => {
            var _a, _b;
            if (bodyNode.type === 'ExpressionStatement') {
                let indivUpdateObj = {};
                indivUpdateObj.typeOfExpression = bodyNode.expression.type;
                //*****need to add a varName t the object in the case that the below conditional does not hit*****
                if (bodyNode.expression.type = 'AssignmentExpression') {
                    //it is either a direct update
                    //which means it has NO left or right
                    if (!bodyNode.expression.left) {
                        indivUpdateObj.varName = (_b = (_a = bodyNode.expression.argument) === null || _a === void 0 ? void 0 : _a.loc) === null || _b === void 0 ? void 0 : _b.identifierName;
                    }
                    else {
                        //or it is an assignment 
                        //which means we need to know the object it belongs to and the property we are updating
                        //We need to fix this to either figure out the base object (maybe ONLY the base object)
                        //that we are updating (eg. what is ALLLL the way left (`big`) in big.random.object.we.are.updating)
                        indivUpdateObj.varName = bodyNode.expression.left.object.name + "." + bodyNode.expression.left.property.name;
                        updatesArr.push(indivUpdateObj);
                    }
                }
                //push the updateObj to updatesArr
                updatesArr.push(indivUpdateObj);
            }
        });
        //return the full list of updates
        return updatesArr;
    }
    //should probably split this up into 'internally declares' variables and 'parameters' bc theyre different enough 
    listDeclares(path) {
        let declaresArr = [];
        //bindings are things that the functions *creates*/*declares* and binds values to? 
        //ie: parameters for the args that get passed in and vars named in the func
        //these are all in a convenient object, so we can just iterate through it
        for (let binding in path.scope.bindings) {
            let indivDeclareObj = {};
            indivDeclareObj.varName = path.scope.bindings[binding].identifier.name;
            declaresArr.push(indivDeclareObj);
        }
        return declaresArr;
    }
    // lists the upstream dependencies of the objects 
    // probably need to fix this function a bit
    listDepends(path) {
        //get function name
        const funcName = this.funcName;
        //create an array for everything that the function declares
        let simpleDeclares = [];
        //iterate through it 
        this.declares.forEach(el => {
            // console.log(el)
            simpleDeclares.push(el.varName);
        });
        //create a list to hold all dependencies
        let dependsList = [];
        //traverse for identifiers.
        //logic here is that anything identifier that is not DECLARED by the function is necessarily DEPENDED ON by the function
        path.traverse({
            Identifier(path) {
                // if the identifier is the function name (redundant) or is included in the list of what it declares
                // then it is not something the function depends on
                if (!simpleDeclares.includes(path.node.name) && path.node.name != funcName) {
                    //delete all these comments between the two uncommented lines if this works fine
                    //   // console.log(`${path.node.name} is an INTERNAL variable`)
                    //   // i think we can get rid of this first if statement, there's nothing here
                    // } else {
                    //if it is not, then it
                    // console.log(`${path.node.name} is an EXTERNAL variable`)
                    dependsList.push(path.node.name);
                }
            }
        });
        return dependsList;
    }
    //lists what the function can return
    listReturns(path) {
        let returnVal = [];
        //each func has a return statement (potentially more than 1)
        //this will need to be updated to better handle the case of multiple returns (eg. conditional returns) later
        path.node.body.body.forEach((bodyNode) => {
            if (bodyNode.type === 'ReturnStatement') {
                returnVal.push(bodyNode.argument.name);
            }
        });
        return returnVal;
    }
}
//utility function, just allows you to pass a tree in and do a bunch of logs, you can use or ignore
function info(tree) {
    console.log('**** TREE.ROUTERS **** {object}');
    console.log(tree);
    console.log('**** TREE.ROUTERS **** [array]');
    console.log(tree.routers);
    console.log('**** TREE.ROUTERS.STACK **** [array]');
    tree.routers.forEach(el => {
        console.log(el);
    });
    console.log('**** TREE.ROUTERS.STACK[i].endpoints{}.stack **** {obj}');
    // tree.routers.forEach(el => {
    //   for (let endpoint in el.endpoints) {
    //     console.log(el.endpoints[endpoint])
    //   }
    // })
    // stack.forEach(el => console.log(el))
}
// start location parsing function
function isolateNumbers(string) {
    //get start index of S
    //can probs change this to CBUSTART and adjust the number (I think it'd be 8)
    const startIndex = string.indexOf('S') + 5;
    let numbers = '';
    //iterate through string until you hit something thats not a number (end of start portion of funcName)
    for (let i = startIndex; i < string.length; i++) {
        if (!isNaN(string[i])) {
            numbers += string[i];
        }
        else {
            break;
        }
    }
    return numbers;
}
// path parsing function
function isolatePath(string) {
    //path goes from start of CBUPATH_$ to end of string
    const startIndex = string.indexOf('CBUPATH_$');
    let slicedString = string.slice(startIndex + 7);
    //un-replace all the sanitized characters with / and . to recreate the filepath
    let parsedPath = slicedString.replaceAll('$', '/').replaceAll('_', '.');
    return parsedPath;
}
// info(originalTree)
// create a function
// it will take the old tree and the new tree
function mergeTrees(oldTree, renamedTree) {
    //iterate through new tree
    //tree (obj)
    //routers (v. bound dispatch) [arr of {obj}]
    //for each router
    for (let routerNum = 0; routerNum < oldTree.routers.length; routerNum++) {
        //for each endpoint in the router, make
        for (let endpoint in oldTree.routers[routerNum].endpoints) {
            //loop through the endpoint's mw
            let currentMw = oldTree.routers[routerNum].endpoints[endpoint]['middlewareChain'];
            let matchingMw = renamedTree.routers[routerNum].endpoints[endpoint]['middlewareChain'];
            // iterate through middleware linked list and get func info for each one
            // pulling from the matching mw where necessary
            while (currentMw) {
                //assign info
                currentMw.name = matchingMw.name;
                currentMw.startingPosition = parseInt(isolateNumbers(currentMw.name));
                currentMw.filePath = "." + isolatePath(currentMw.name);
                currentMw.funcInfo = getFuncInfo(currentMw.filePath, currentMw.startingPosition);
                //move on
                currentMw = currentMw.nextFunc;
                matchingMw = matchingMw.nextFunc;
            }
        }
    }
    // return the old tree with name properties on its middleware chain nodes
    return oldTree;
}
const mergedTree = mergeTrees(originalTree, renamedTree);
function getFuncInfo(filePath, startingIndex) {
    // console.log("filepath in getFuncInfo:" , filePath)
    const code = fs.readFileSync(filePath).toString();
    let funcInfo = {};
    const ast = parser.parse(code);
    // traverses functions with names
    traverse(ast, {
        FunctionDeclaration(path) {
            //get the starting index of the node we are on
            const start = path.node.loc.start.index;
            // check if the line number of interest is within the start and end lines of the function definition
            if (startingIndex === start) {
                // stop the traversal once we have found the information we are looking for
                // because we are only interested in the first function definition that matches line number
                let newFuncInfo = new FuncObject(path);
                funcInfo = newFuncInfo;
            }
        }
    });
    // traverses anonymous functions
    traverse(ast, {
        FunctionExpression(path) {
            //get the starting index of the node we are on
            const start = path.node.loc.start.index;
            // check if the line number of interest is within the start and end lines of the function definition
            if (startingIndex === start) {
                // stop the traversal once we have found the information we are looking for
                // because we are only interested in the first function definition that matches line number
                let newFuncInfo = new FuncObject(path);
                funcInfo = newFuncInfo;
            }
        }
    });
    // traverses arrow functions
    traverse(ast, {
        ArrowFunctionExpression(path) {
            //get the starting index of the node we are on
            const start = path.node.loc.start.index;
            // check if the line number of interest is within the start and end lines of the function definition
            if (startingIndex === start) {
                // stop the traversal once we have found the information we are looking for
                // because we are only interested in the first function definition that matches line number
                let newFuncInfo = new FuncObject(path);
                funcInfo = newFuncInfo;
            }
        }
    });
    // return the func info object
    return funcInfo;
}
const finalObj = [];
// console.log(mergedTree)
// console.log(mergedTree.routers)
mergedTree.routers.forEach(route => {
    // console.log(route.endpoints)
    for (let endpoint in route.endpoints) {
        let routeObj = {};
        //save path to a variable
        let endpointPath = route.endpoints[endpoint].path;
        //save methods to a variable (may need to fix later for multiple endpoints on single route?)
        let endpointMethod = Object.keys(route.endpoints[endpoint].methods)[0];
        // console.log(endpointPath, endpointMethod)
        //check if endpoint exists, if not, make it and an array for its methods
        if (!routeObj[endpointPath]) {
            console.log("didnt exist");
            routeObj.routeName = endpointPath;
            routeObj.routeMethods = {};
            routeObj.routeMethods[endpointMethod] = {};
        }
        // routeObj.routeMethods[endpointMethod] = {}
        //this keeps the mwChain as a linkedList
        // routeObj.routeMethods[endpointMethod].middlewareChain = route.endpoints[endpoint].middlewareChain
        //this will make it into an array
        routeObj.routeMethods[endpointMethod].middlewares = [];
        let current = route.endpoints[endpoint].middlewareChain;
        while (current) {
            routeObj.routeMethods[endpointMethod].middlewares.push(current);
            current = current.nextFunc;
        }
        // console.log(route.endpoints[endpoint].middlewareChain)
        finalObj.push(routeObj);
    }
});
console.log(finalObj);
// console.log(finalObj)
console.log(finalObj);
console.dir(finalObj, { depth: 4 });
console.log(finalObj[0].routeName);
console.dir(finalObj[0].routeMethods, { depth: 5 });
// console.log(finalObj[0].routeMethods.delete.middlewares[0])
// console.log('///// FUNC INFO PART OF OBJ /////')
// // funcName: 'getCharacters',
// console.log("funcName:", finalObj[2].routeMethods.get.middlewares[0].funcInfo.funcName)
// // funcFile: '/Users/melodyduany/Documents/Codesmith/unit-10-databases/server/controllers/starWarsController.js',
// console.log("funcFile:", finalObj[2].routeMethods.get.middlewares[0].filePath)
// // funcPosition: [6, 40],
// console.log("funcPosition:",finalObj[2].routeMethods.get.middlewares[0].funcInfo.location.start.index, finalObj[0].routeMethods.delete.middlewares[0].funcInfo.location.end.index)
// console.log("funcDef:", finalObj[2].routeMethods.get.middlewares[0].funcString)
// console.log("funcFile:", finalObj[0].routeMethods.delete.middlewares[0])
// funcDef: 'lorem ipsum dolor sit amet',
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
//               dependentFuncFile : 'addCharacters dependentfunc1 file path',
//               dependentFuncPosition: [2, 12],
//               dependentFuncDef : 'addCharacters dependentfunc1 definition'
// depUseInFunc
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
