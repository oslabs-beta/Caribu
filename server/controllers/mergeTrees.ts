const mergeTreesExport = (req, res, next) => {
  const originalTree = require('../originalAppTree.json')
  const renamedTree = require('../renamedAppTree.json')
  const fs = require('fs')
  const parser = require('@babel/parser')
  const { parse } = require('@babel/core')

  const  traverse = require('@babel/traverse').default
  const { isGeneratorFunction } = require('util/types')
  // const traverse = _traverse.default;


  //could be modified to also hold the code of the file so that we don't re-read code to make ASTs all the time when weve already done it once
  const fileVars = {}

  class FuncObject {
    constructor (path, filePath, code, ast) {
      this.path = path
      this.filePath = filePath
      this.globalVars = this.listGlobals(ast, code, filePath)
      this.funcName = this.funcLabel(path) || `anonymous_function_at_${path.node.start}-${path.node.end}_in_${filePath}` // need oto fix to align better with rest of func naming
      this.params = this.listParams(path, filePath)
      this.declares = this.listDeclares(path, filePath, code)
      this.returns = this.listReturns(path, code)
      this.depends = {}
      this.updates = {}
      this.location = path.node.loc
      //???????? vvvvvvv
      this.allVars = this.listAllVars
    }

    listGlobals (ast, code, filePath) {
      //if fileVars obj does not have a poperty for this filePath, add it and do the rest
      if (!fileVars[filePath]) {
        fileVars[filePath] = {
          globalDeclarations : {},
          functionLevelDeclarations : []
        }
      }

      ast.program.body.forEach((bodyNode) => {
        if (bodyNode.type === 'VariableDeclaration') {
          bodyNode.declarations.forEach(declaration => {
            let declarationObj = {}
            declarationObj.declaredName = declaration.id.name
            declarationObj.type = bodyNode.kind
            declarationObj.definition = code.slice(bodyNode.start, bodyNode.end)
            declarationObj.position = [bodyNode.start, bodyNode.end] 
            fileVars[filePath].globalDeclarations[declaration.id.name] = declarationObj
          })
        }
      })
    }

    funcLabel (path) {
      // either name the function after its name, or give it an anonymous function name through
      // the OR statement in the constructor
      //
      return path.node.id?.name || false
    }

    listParams (path, filePath) {
      let paramArr = []
      path.scope.block.params.forEach(el => paramArr.push(el.name))
      return paramArr
    }

    listUpdates () {
      let path = this.path;
      let filePath = this.filePath;
      let code = fs.readFileSync(filePath).toString()
      let funcName = this.funcName;
      //an updates variable is:
        //any variables that ARE
          //variables in global scope
          //that are
            //in an assignment expression
              //the value of the left node
                //if identifier
                  //name of the identifier
                //if member expression
                  //the full member expression
            //in an update expression
              //the argument of the updateExpression
                //in the case of an identifier
                  //name of the identifier
                //in the case of a member expression
                  //the full member expression
      const updatesArr = []

      function findOriginalDeclaration (varName, filePath, funcName) {
        // console.log(varName)
        // console.log(fileVars[filePath])
        let originalDeclaration = false
        // go to fileVars[filePath]
        // loop through globals
        //for variable in globals
        // console.log("varName", varName)
        // console.log("filePath", filePath)
        // console.log("fileVars[filePath]", fileVars[filePath])
        
        // console.log(fileVars[filePath])
        for (let declaration in fileVars[filePath].globalDeclarations) {
          //if declaredName matchesVarName
          if (declaration.declaredName === varName) {
            // originalDeclaration = globals[variable]
            originalDeclaration = declaration
          }
        }
        // loop through functionDeclarations to make sure it doesnt appear in there
        let varNotAlreadyDeclared = true
        fileVars[filePath].functionLevelDeclarations.forEach(declaration => {
          if (funcName === declaration.funcName) {
            varNotAlreadyDeclared = false
          }
        })
        //foreach declaration in functiondelcattion

        if (varNotAlreadyDeclared) {
          fileVars[filePath].functionLevelDeclarations.forEach(declaration => {
            // console.log('PLEASEEEEEEEEEE')
              if (declaration.declaredName === varName) {
                // console.log(funcName, declaration.funcName)
                // console.log(declaration)
                originalDeclaration = declaration
              }
          })
        }
        return originalDeclaration
      }   

      const assignmentChecker = {
        AssignmentExpression(path) {
          const newUpdateObj = {
            dependentFuncName : '',
            dependentFuncFile : '',
            dependentFuncPosition : [],
            dependentFuncDef : '',
            updateName : '',
            updateType : 'AssignmentExpression',
            updateDefinition : '',
            updatePosition : [],
            originallyDeclared : false
          }
          // console.log("ASSINGMENT EXPRESSION LEFT")
            // console.log(path)
            // console.log(path.node.left)
            if (path.node.left.type === 'MemberExpression') {
              // console.log('dependency - object / memberExpression: ', code.slice(path.node.left.start, path.node.left.end))
              newUpdateObj.dependentFuncName = newUpdateObj.updateName = code.slice(path.node.left.start, path.node.left.end)
              newUpdateObj.dependentFuncDef = newUpdateObj.updateDefinition = code.slice(path.node.start, path.node.end)
              newUpdateObj.dependentFuncPosition = newUpdateObj.updatePosition = [path.node.start, path.node.end]
              newUpdateObj.originallyDeclared = findOriginalDeclaration(newUpdateObj.updateName, filePath)
            }
            if (path.node.left.type === 'Identifier') {
              // console.log("dependency - identifier: ", path.node.left.name)
              newUpdateObj.dependentFuncName = newUpdateObj.updateName = path.node.left.name
              newUpdateObj.dependentFuncDef = newUpdateObj.updateDefinition = code.slice(path.node.start, path.node.end)
              newUpdateObj.dependentFuncPosition = newUpdateObj.updatePosition = [path.node.start, path.node.end]
              newUpdateObj.originallyDeclared = findOriginalDeclaration(newUpdateObj.updateName, filePath)
            }
            // console.log("3824628957w389456w489553824628957w389456w489553824628957w389456w48955\n NEW UPDATE OBJ \n 3824628957w389456w489553824628957w389456w489553824628957w389456w48955\n")
            if (newUpdateObj.originallyDeclared) {
              // console.log("VALID UPDATE:")
              // console.log(newUpdateObj)
              updatesArr.push(newUpdateObj)
            } else {
              // console.log("INVALID UPDATE (not pushed):")
              // console.log(newUpdateObj)
            }
            
            // console.log("path.expression.args:" , path.expression.arguments)
        }
      }

      const updateChecker = {
        UpdateExpression(path) {
          const newUpdateObj = {
            dependentFuncName : '',
            dependentFuncFile : '',
            dependentFuncPosition : [],
            dependentFuncDef : '',
            updateName : '',
            updateType : 'UpdateExpression',
            updateDefinition : '',
            updatePosition : [],
            originallyDeclared : false
          }
          // console.log("ASSINGMENT EXPRESSION LEFT")
            // console.log(path)
            // console.log(path.node.left)
            if (path.node.argument === 'MemberExpression') {
              // console.log('dependency - object / memberExpression: ', code.slice(path.node.left.start, path.node.left.end))
              newUpdateObj.dependentFuncName = newUpdateObj.updateName = code.slice(path.node.argument.start, path.node.argument.end)
              newUpdateObj.dependentFuncDef = newUpdateObj.updateDefinition = code.slice(path.node.start, path.node.end)
              newUpdateObj.dependentFuncPosition = newUpdateObj.updatePosition = [path.node.start, path.node.end]
              newUpdateObj.originallyDeclared = findOriginalDeclaration(newUpdateObj.updateName, filePath)
            }
            if (path.node.argument === 'Identifier') {
              // console.log("dependency - identifier: ", path.node.left.name)
              newUpdateObj.dependentFuncName = newUpdateObj.updateName = path.node.argument.name
              newUpdateObj.dependentFuncDef = newUpdateObj.updateDefinition = code.slice(path.node.start, path.node.end)
              newUpdateObj.dependentFuncPosition = newUpdateObj.updatePosition = [path.node.start, path.node.end]
              newUpdateObj.originallyDeclared = findOriginalDeclaration(newUpdateObj.updateName, filePath)
            }
            // console.log("3824628957w389456w489553824628957w389456w489553824628957w389456w48955\n NEW UPDATE OBJ \n 3824628957w389456w489553824628957w389456w489553824628957w389456w48955\n")
            if (newUpdateObj.originallyDeclared) {
              // console.log("VALID UPDATE:")
              // console.log(newUpdateObj)
              updatesArr.push(newUpdateObj)
            } else {
              // console.log("INVALID UPDATE (not pushed):")
              // console.log(newUpdateObj)
            }
            
            // console.log("path.expression.args:" , path.expression.arguments)
        }
      }

      path.traverse(assignmentChecker)
      path.traverse(updateChecker)

      this.updates = updatesArr
    }


    listDeclares (path, filePath, code) {
      const funcName = this.funcName


      //any variables that 
        //other functions declare
        //or ar declared in a global scope
        //that appear in the function
        //and are not updated

      // console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n IN LIST DECLARES %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%')
      // console.log(path)
      const declaresArr = []
      const nestedVisitor = {
        VariableDeclaration(path) {
          //*******NEED TO CONTROL FOR FOROF AND FORIN STATEMENTS (eg. const char of characters)
          // console.log(path)
          // console.log(path.node.declarations)
          path.node.declarations.forEach(declaration => {
            let declarationObj = {}
            declarationObj.funcName = funcName
            // `${funcName}_at_${path.node.start}-${path.node.end}_in_${filePath}`
            declarationObj.declaredName = declaration.id.name
            declarationObj.type = path.node.kind
            declarationObj.definition = code.slice(path.node.start, path.node.end)
            declarationObj.filePath = filePath
            declarationObj.position = [path.node.start, path.node.end] 
            // console.log(declarationObj)
            declaresArr.push(declarationObj)
        })

        }
      }
      path.traverse(nestedVisitor)

      fileVars[filePath].functionLevelDeclarations = declaresArr
      return declaresArr
    }

    listDepends () {
      let path = this.path;
      let filePath = this.filePath;
      let code = fs.readFileSync(filePath).toString()
      const funcName = this.funcName
      let dependsList = []
        //a dependency is an identifier...
        //that appears in the global/func variables list for its given file that is...
          //any identifier whose direct parent is neither: assignment expression, update, expression, or member expression
          //any member expression whose direct parent is neither: assignment, update expression, or member expression

      function findOriginalDeclaration (varName, filePath, funcName) {
        // console.log(varName)
        // console.log(fileVars[filePath])
        let originalDeclaration = false
        // go to fileVars[filePath]
        // loop through globals
        //for variable in globals
        // console.log("varName", varName)
        // console.log("filePath", filePath)
        // console.log("fileVars[filePath]", fileVars[filePath])
        
        // console.log(fileVars[filePath])
        for (let declaration in fileVars[filePath].globalDeclarations) {
          //if declaredName matchesVarName
          if (declaration.declaredName === varName) {
            // originalDeclaration = globals[variable]
            originalDeclaration = declaration
          }
        }
        // loop through functionDeclarations to make sure it doesnt appear in there
        let varNotAlreadyDeclared = true
        fileVars[filePath].functionLevelDeclarations.forEach(declaration => {
          if (funcName === declaration.funcName) {
            varNotAlreadyDeclared = false
          }
        })
        //foreach declaration in functiondelcattion

        if (varNotAlreadyDeclared) {
          fileVars[filePath].functionLevelDeclarations.forEach(declaration => {
            // console.log('PLEASEEEEEEEEEE')
              if (declaration.declaredName === varName) {
                // console.log(funcName, declaration.funcName)
                // console.log(declaration)
                originalDeclaration = declaration
              }
          })
        }
        return originalDeclaration
      }   


      // NEED A MEMBER EXPRESSION VERSION OF THIS TRAVERSAL
      path.traverse({
        Identifier(path) {
          // console.log("PARENT OF IDENTIFIER IN LIST DEPENDS")
          if (path.parent.type !== 'MemberExpression' && path.parent.type !== 'UpdateExpression' && path.parent.type !== 'AssignmentExpression') {
            // console.log(path)
            let originalDeclaration = findOriginalDeclaration(path.node.name, filePath, funcName)
            if (originalDeclaration) {
              let dependsVar = {
                upVarName : path.node.name,
                upVarFile : filePath,
                upVarPosition : [path.node.start, path.node.end],
                // upVarDef : originalDeclaration.definition
                location : [path.node.start, path.node.end],
                originalDeclaration
              }
              dependsList.push(dependsVar)
              // console.log(dependsVar)
            }
          }
        }
      })
      this.depends = dependsList
    }

    listReturns (path, code) {
      console.log(path)
      let returnVal = []

      //if a is a one-liner that sends a response or otherwise calls a function, deal with it (eg. `(req, res) => json.status(200).json({obj:ect})`)
      if (path.node.body.type === 'CallExpression') {
        returnVal.push(code.slice(path.node.body.start, path.node.body.end))
        return returnVal
      }

      //other than one liners, each func has a return statement (potentially more than 1)
      //this will need to be updated to better handle the case of multiple returns (eg. conditional returns) late
      
      //we should turn this into a traversal so that we can deal with nested or conditional returns
      path.node.body.body.forEach(bodyNode => {
        if (bodyNode.type === 'ReturnStatement') {
          returnVal.push(bodyNode.argument.name)
        }
      })
      return returnVal
    }

    deletePath () {
      delete this.path
    }
  }


  function info (tree) {
    console.log('**** TREE.ROUTERS **** {object}')
    // console.log(tree)
    console.log('**** TREE.ROUTERS **** [array]')
    // console.log(tree.routers)
    console.log('**** TREE.ROUTERS.STACK **** [array]')
    // tree.routers.forEach(el => {
    //   console.log(el)
    // })
    console.log('**** TREE.ROUTERS.STACK[i].endpoints{}.stack **** {obj}')
    // tree.routers.forEach(el => {
    //   for (let endpoint in el.endpoints) {
    //     console.log(el.endpoints[endpoint])
    //   }
    // })
    // stack.forEach(el => console.log(el))
  }

  function isolateNumbers(string) {
    const startIndex = string.indexOf('CBUSTART') + 8;
    let numbers = '';
    for (let i = startIndex; i < string.length; i++) {
      if (!isNaN(string[i])) {
        numbers += string[i];
      } else {
        break;
      }
    }
    console.log("NUMBERS: ", numbers)
    return numbers;
  }

  function isolatePath (string) {
    // const startIndex = string.indexOf('CBUPATH_$')+7 || string.indexOf('CBUPATH')+7
    const startIndex = string.indexOf('CBUPATH')+7
    let slicedString = string.slice(startIndex)
    console.log("orignal path from name", slicedString)
    let parsedPath = slicedString.replaceAll('$', '/').replaceAll('_','.').replaceAll('Ü','-')
    console.log("cleaned path from name", parsedPath)
    return parsedPath
  }

  function isolateType (string) {
    const nameStart = string.indexOf('CBUTYPE_')+8
    const firstUnder = string.indexOf('_', nameStart + 12)
    let funcType = string.slice(nameStart, firstUnder)
    return funcType
  }

  // info(originalTree)



  // create a function
  // it will take the old tree and the new tree
  function mergeTrees (oldTree, renamedTree) {
    // iterate through new tree
    //tree (obj)
    //routers (v. bound dispatch) [arr of {obj}]
      for (let routerNum = 0; routerNum < oldTree.routers.length; routerNum++) {
        
        for (let endpoint in oldTree.routers[routerNum].endpoints) {
          console.log('ENDPOINT', oldTree.routers[routerNum].endpoints[endpoint])
          console.log('RENAMED ENDPOINT VVVVVVVVV')
          console.log('RENAMED ENDPOINT', renamedTree.routers[routerNum].endpoints[endpoint])
          
          //loop through mw
          let currentMw = oldTree.routers[routerNum].endpoints[endpoint]['middlewareChain']
          let matchingMw = renamedTree.routers[routerNum].endpoints[endpoint]['middlewareChain']
          //iterate through ll
          while (currentMw) {
            // matchingMw.name = isolateName(matchingMw.funcString)
            // currentMw.name = renamedTree.routers[routerNum].endpoints[endpoint]['middlewareChain'].name
            currentMw.name = matchingMw.name
            currentMw.type = isolateType(currentMw.name)
            // console.log("CURRENT MW:",  currentMw)
            // console.log("MATCHING MW:",  matchingMw)
            currentMw.startingPosition = parseInt(isolateNumbers(currentMw.name))
            // currentMw.startingPosition = parseInt(isolateNumbers(currentMw.name))
            // currentMw.filePath = "." + isolatePath(currentMw.name)
            currentMw.filePath = "/" + isolatePath(currentMw.name)
            // currentMw.filePath = isolatePath(currentMw.name)
            currentMw.funcInfo = getFuncInfo(currentMw.filePath, currentMw.startingPosition, currentMw.type)

            currentMw = currentMw.nextFunc
            matchingMw = matchingMw.nextFunc
          }
        }
      }
    
    //
    
    // return the old tree with name properties on its middleware chain nodes
    return oldTree
  }

  const mergedTree = mergeTrees(originalTree, renamedTree)

  function getFuncInfo (filePath, startingIndex, funcType) {
    // console.log("filepath in getFuncInfo:" , filePath)
    const code = fs.readFileSync(filePath).toString()
    let funcInfo = null
    const ast = parser.parse(code)
    // console.log(funcType)
    // console.log(ast)
    if (funcType === 'FUNCTIONDECLARATION') {
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
              let newFuncInfo = new FuncObject(path, filePath, code, ast)
              // console.log(newFuncInfo);
              funcInfo = newFuncInfo
              // path.stop();
            }
        }
        
      });
    }

    if (funcType === 'FUNCTIONEXPRESSION') {
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
              let newFuncInfo = new FuncObject(path, filePath, code, ast)
              // console.log(newFuncInfo);
              funcInfo = newFuncInfo
              // path.stop();
            }
        }
        
      });
    }

    if (funcType === 'ARROWFUNCTION') {
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
              let newFuncInfo = new FuncObject(path, filePath, code, ast)
              // console.log(newFuncInfo);
              funcInfo = newFuncInfo
              // path.stop();
            }
        }
        
      });
    }
    // console.log(funcInfo)
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
        // console.log("didnt exist")
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
        // console.log("THIS IS CURRENT:", current)
        current.funcInfo.listUpdates()
        current.funcInfo.listDepends()
        current.funcInfo.deletePath()
        routeObj.routeMethods[endpointMethod].middlewares.push(current)
        current = current.nextFunc
      }


      // console.log(route.endpoints[endpoint].middlewareChain)
      finalObj.push(routeObj)
    }
  })


  // //Upstream dependencies:
  // let upDep : any = {
  //   name : "varName",
  //   file : "varFile",
  //   positionUsedInFunc : 69,
  //   definition : 'stringOfDefinition'
  // }

  // let interDep : any = {
  //   name : "varName",
  //   file : "varFile",
  //   positionMutatedInFunc : [69],
  //   definition : ['maybe this and posMutatedInFunc should be the same?'],
  //   expressionsThatUse : [{
  //     expressionType : 'variable or function?',
  //     expressionName : 'variable or function name (or anonymous func) ((might be cool to associate with specific MW))',
  //     expressionFile : 'expFile',
  //     positionUsedInExpression : 69,
  //     updatesOrDepends : ['updates' || 'depends']
  //   }]
  // }

  // finalObj.forEach(el => {
  //   console.log(el.routeMethods)
  //   console.log('\n\nBREAK\n\n')
  //   console.log(el.routeMethods?.post?.middlewares[0].funcInfo)
  //   console.log(el.routeMethods?.post?.middlewares[1].funcInfo)
  //   console.log('\n\nBREAK\n\n')
  //   console.log(el.routeMethods?.get?.middlewares[0].funcInfo)
  //   console.log(el.routeMethods?.get?.middlewares[1].funcInfo)
  //   console.log('\n\nBREAK\n\n')
  //   console.log(el.routeMethods?.delete?.middlewares[0].funcInfo)
  //   console.log(el.routeMethods?.delete?.middlewares[1].funcInfo)
  // })

  finalObj.forEach(route => {
    let methodObj = route.routeMethods
    // console.log(methodObj)
    for (const method in methodObj) {
      let oneMethod = methodObj[method]
      // console.log(oneMethod)
      oneMethod.middlewares.forEach((middleware, i) => {
        let newObj = {}
        newObj.functionInfo = {
          funcName : middleware.name,
          funcFile : middleware.filePath,
          funcPosition : [middleware.funcInfo.location.start.index, middleware.funcInfo.location.end.index],
          funcDef : middleware.funcString
        }
        console.log(middleware.funcInfo.depends)
        newObj.deps =  {
          upstream : { dependents : middleware.funcInfo.depends || []},
          downstream : { dependents : middleware.funcInfo.updates || []}
        }

        route.routeMethods[method].middlewares[i] = newObj
        console.log('NEW OBJ IN ROUTE: ', method)
        console.log('IN FUNC: ', middleware.name)
        // console.dir(newObj.deps, {depth : 4})
        // console.log(methodObj[method][i])
      })
      // console.log(oneMethod)
    }
  })

  res.locals.tree = finalObj;
  next()
}

// mergeTreesExport()

module.exports = mergeTreesExport