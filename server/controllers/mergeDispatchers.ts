const mergeDispatchersExport = (req, res, next) => {
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
      this.code = code
      this.path = path
      this.filePath = filePath
      this.globalVars = this.listGlobals(ast, code, filePath)
      this.funcName = this.funcLabel(path) || `anonymous_function_at_${path.node.start}-${path.node.end}_in_${filePath}` // need oto fix to align better with rest of func naming
      this.assignedTo = this.getAssignedTo(path, code) || null
      this.params = this.listParams(path, filePath)
      this.declares = this.listDeclares(path, filePath, code)
      this.returns = this.listReturns(path, code)
      this.depends = {}
      this.updates = {}
      this.location = path.node.loc 
      this.line = this.getLine(path) || null
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
            // console.log("bodyNode.declaration", declaration)
            let declarationObj = {}
            declarationObj.declaredName = declaration.id.name
            declarationObj.type = bodyNode.kind
            declarationObj.definition = code.slice(bodyNode.start, bodyNode.end)
            declarationObj.position = [bodyNode.start, bodyNode.end] 
            declarationObj.line = [bodyNode.loc.start.line, bodyNode.loc.end.line] 
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

    getLine(path) {
      return [path.node.loc.start.line, path.node.loc.start.column]
    }

    getAssignedTo (path, code) {
      if (path.parent.type === 'AssignmentExpression') {
        return code.slice(path.parent.left.start, path.parent.left.end)
      }
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
        let originalDeclaration = false
        // go to fileVars[filePath]
        // loop through globals
        //for variable in globals
        for (let declaration in fileVars[filePath].globalDeclarations) {
          //if declaredName matchesVarName
          if (fileVars[filePath].globalDeclarations[declaration].declaredName === varName) {
            // originalDeclaration = globals[variable]
            originalDeclaration = fileVars[filePath].globalDeclarations[declaration]
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
              if (declaration.declaredName === varName) {
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
            if (path.node.left.type === 'MemberExpression') {
              newUpdateObj.dependentFuncName = newUpdateObj.updateName = code.slice(path.node.left.start, path.node.left.end)
              newUpdateObj.dependentFuncDef = newUpdateObj.updateDefinition = code.slice(path.node.start, path.node.end)
              newUpdateObj.dependentFuncPosition = newUpdateObj.updatePosition = [path.node.start, path.node.end]
              newUpdateObj.originallyDeclared = findOriginalDeclaration(newUpdateObj.updateName, filePath)
            }
            if (path.node.left.type === 'Identifier') {
              newUpdateObj.dependentFuncName = newUpdateObj.updateName = path.node.left.name
              newUpdateObj.dependentFuncDef = newUpdateObj.updateDefinition = code.slice(path.node.start, path.node.end)
              newUpdateObj.dependentFuncPosition = newUpdateObj.updatePosition = [path.node.start, path.node.end]
              newUpdateObj.originallyDeclared = findOriginalDeclaration(newUpdateObj.updateName, filePath)
            }
            if (newUpdateObj.originallyDeclared) {
              updatesArr.push(newUpdateObj)
            } else {
              //do nothing
            }
            
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
            if (path.node.argument === 'MemberExpression') {
              newUpdateObj.dependentFuncName = newUpdateObj.updateName = code.slice(path.node.argument.start, path.node.argument.end)
              newUpdateObj.dependentFuncDef = newUpdateObj.updateDefinition = code.slice(path.node.start, path.node.end)
              newUpdateObj.dependentFuncPosition = newUpdateObj.updatePosition = [path.node.start, path.node.end]
              newUpdateObj.originallyDeclared = findOriginalDeclaration(newUpdateObj.updateName, filePath)
            }
            if (path.node.argument === 'Identifier') {
              newUpdateObj.dependentFuncName = newUpdateObj.updateName = path.node.argument.name
              newUpdateObj.dependentFuncDef = newUpdateObj.updateDefinition = code.slice(path.node.start, path.node.end)
              newUpdateObj.dependentFuncPosition = newUpdateObj.updatePosition = [path.node.start, path.node.end]
              newUpdateObj.originallyDeclared = findOriginalDeclaration(newUpdateObj.updateName, filePath)
            }
            if (newUpdateObj.originallyDeclared) {
              updatesArr.push(newUpdateObj)
            } else {
              //do nothing
            }
            
        }
      }

      path.traverse(assignmentChecker)
      path.traverse(updateChecker)
      console.log(updatesArr)
      this.updates = updatesArr
    }


    listDeclares (path, filePath, code) {
      const funcName = this.funcName

      const declaresArr = []
      const nestedVisitor = {
        VariableDeclaration(path) {
          //*******NEED TO CONTROL FOR FOROF AND FORIN STATEMENTS (eg. const char of characters)
          path.node.declarations.forEach(declaration => {
            let declarationObj = {}
            declarationObj.funcName = funcName
            // `${funcName}_at_${path.node.start}-${path.node.end}_in_${filePath}`
            declarationObj.declaredName = declaration.id.name
            declarationObj.type = path.node.kind
            declarationObj.definition = code.slice(path.node.start, path.node.end)
            declarationObj.filePath = filePath
            declarationObj.position = [path.node.start, path.node.end] 
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
      code = this.code
        //a dependency is an identifier...
        //that appears in the global/func variables list for its given file that is...
          //any identifier whose direct parent is neither: assignment expression, update, expression, or member expression
          //any member expression whose direct parent is neither: assignment, update expression, or member expression

      function findOriginalDeclaration (varName, filePath, funcName) {
        // if (varName === 'testNum') {
        //   console.log("in FIND ORIGIALN DEC WITH TESTNUM")
        //   console.log(fileVars[filePath].globalDeclarations)
        // }
        let originalDeclaration = false
        // go to fileVars[filePath]
        // loop through globals
        //for variable in globals
        for (let declaration in fileVars[filePath].globalDeclarations) {
          //if declaredName matchesVarName
          // if (varName === 'testNum') console.log(fileVars[filePath].globalDeclarations[declaration], varName)
          if (fileVars[filePath].globalDeclarations[declaration].declaredName === varName) {
            // originalDeclaration = globals[variable]
            originalDeclaration = fileVars[filePath].globalDeclarations[declaration]
            // console.log("hit!!")
            // return originalDeclaration
          }
        }
        // if (varName === 'testNum') console.log(originalDeclaration)
        // loop through functionDeclarations to make sure it doesnt appear in there
        let varNotAlreadyDeclared = true
        fileVars[filePath].functionLevelDeclarations.forEach(declaration => {
          if (funcName === declaration.funcName) {
            varNotAlreadyDeclared = false
          }
        })
        
        // this.declares.forEach(declaration => {
        //   if (funcName)
        // })
        //foreach declaration in functiondelcattion
        // if (varName === 'testNum') console.log(originalDeclaration)

        if (varNotAlreadyDeclared) {
          fileVars[filePath].functionLevelDeclarations.forEach(declaration => {
              if (declaration.declaredName === varName) {
                originalDeclaration = declaration
              }
          })
        }
        
        // if (varName === 'testNum') console.log(originalDeclaration)
        // console.log(originalDeclaration)
        return originalDeclaration
      }   



      // NEED A MEMBER EXPRESSION VERSION OF THIS TRAVERSAL

      path.traverse({
        Identifier(path) {
          if (path.parent.type !== 'MemberExpression' && path.parent.type !== 'UpdateExpression' && path.parent.type !== 'AssignmentExpression') {
            let originalDeclaration = findOriginalDeclaration(path.node.name, filePath, funcName)
            // if (path.node.name === 'testNum') console.log("FOUND TEST NUM")
            if (originalDeclaration) {
              // console.log("made it to original declaration with ")
              // console.log(path.node)
              let dependsVar = {
                upVarName : path.node.name,
                upVarFile : filePath,
                upVarPosition : [path.node.start, path.node.end],
                // upVarDef : originalDeclaration.definition
                location : [path.node.start, path.node.end],
                originalDeclaration
              }
              // console.log(originalDeclaration)
              dependsList.push(dependsVar)
            }
          }
        }
      })




      // console.log("this.declares", this.declares)
      dependsList = dependsList.filter(dep => {
        let check = true
        this.declares.forEach(dec => {
          if (dec.declaredName === dep.upVarName) check = false
        })
        return check
      })
      this.depends = dependsList
      // console.log("this.depends", this.depends)
    }

    listReturns (path, code) {
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

    deleteCode () {
      delete this.code
    }
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
    return numbers;
  }

  function isolatePath (string) {
    // const startIndex = string.indexOf('CBUPATH_$')+7 || string.indexOf('CBUPATH')+7
    const startIndex = string.indexOf('CBUPATH')+7
    let slicedString = string.slice(startIndex)
    let parsedPath = slicedString.replaceAll('$', '/').replaceAll('_','.').replaceAll('Ü','-')
    return parsedPath
  }

  function isolateName (string) {
    // console.log("starting name", string)
    let startOfName = string.indexOf('CBUNAME_')
    let firstParen = string.indexOf('(', startOfName)
    let firstSpace = string.indexOf(' ' ,startOfName)
    let endOfName = Math.min(firstParen, firstSpace)
    // console.log(startOfName, endOfName)
    // console.log("ending name", string.slice(startOfName, endOfName))
    return string.slice(startOfName, endOfName)
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
    const thirdPartyMwLib = {}
    let thirdPartyMwCounter = 0

    for (let bdNum = 0; bdNum < oldTree.boundDispatchers.length; bdNum++) {
      for (let dispatcher in oldTree.boundDispatchers[bdNum]) {
        let currentMw = Object.values(oldTree.boundDispatchers[bdNum]?.endpoints)[0]?.middlewareChain?.middlewareChain
        let matchingMw = Object.values(renamedTree.boundDispatchers[bdNum]?.endpoints)[0]?.middlewareChain?.middlewareChain
        // let currentMw = Object.values(oldTree.boundDispatchers[bdNum]?.endpoints)[0]?.middlewareChain?.middlewareChain
        // let matchingMw = Object.values(renamedTree.boundDispatchers[bdNum]?.endpoints)[0]?.middlewareChain?.middlewareChain
        // let matchingMw = renamedTree.boundDispatchers[bdNum]?.endpoints?.middlewareChain?.middlewareChain
        while (currentMw) {
          let name = isolateName(matchingMw.funcString)
          // console.log("this is name", name)
          // console.log("this is name.length", name.length)
          if (name.length) {
            currentMw.isThirdParty = false
            currentMw.name = isolateName(matchingMw.funcString)
            currentMw.type = isolateType(currentMw.name)
            currentMw.startingPosition = parseInt(isolateNumbers(currentMw.name))
            currentMw.filePath = "/" + isolatePath(currentMw.name)
            // console.log(`filePath: ${currentMw.filePath} | startingPosition: ${currentMw.startingPosition} | type: ${currentMw.type}`)
            currentMw.funcInfo = getFuncInfo(currentMw.filePath, currentMw.startingPosition, currentMw.type)

          } else {
            if (!thirdPartyMwLib[matchingMw.funcString]) {
              currentMw.name = thirdPartyMwLib[matchingMw.funcString] = `CBUNAME_IMPORTEDMIDDLEWARE_${thirdPartyMwCounter}`
              thirdPartyMwCounter++
            }
            currentMw.isThirdParty = true
            currentMw.name = thirdPartyMwLib[matchingMw.funcString]
            currentMw.type = '3P'
            // console.log(currentMw)
          }
          currentMw = currentMw.nextFunc
          matchingMw = matchingMw.nextFunc
        }

        // let currentMw = oldTree.boundDispatchers[bdNum].endpoints
      }
        
    }


    
    //
    
    // return the old tree with name properties on its middleware chain nodes
    // console.log("OLD TREE:", oldTree)
    return oldTree
  }

  

  const mergedTree = mergeTrees(originalTree, renamedTree)

  function getFuncInfo (filePath, startingIndex, funcType) {
    const code = fs.readFileSync(filePath).toString()
    let funcInfo = null
    const ast = parser.parse(code)
    if (funcType === 'FUNCTIONDECLARATION') {
      traverse(ast, {
        //functions with names 
        FunctionDeclaration(path) {
          // given that I have the info about the function in the AST, how can I access the location and pass it in?
          const start = path.node.loc.start.index;
          // check if the line number of interest is within the start and end lines of the function definition
            if (startingIndex === start) {
              // stop the traversal once we have found the information we are looking for
              // because we are only interested in the first function definition that matches line number
              let newFuncInfo = new FuncObject(path, filePath, code, ast)
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
          // given that I have the info about the function in the AST, how can I access the location and pass it in?
          const start = path.node.loc.start.index;
          // check if the line number of interest is within the start and end lines of the function definition
            if (startingIndex === start) {
              // stop the traversal once we have found the information we are looking for
              // because we are only interested in the first function definition that matches line number
              let newFuncInfo = new FuncObject(path, filePath, code, ast)
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
          // given that I have the info about the function in the AST, how can I access the location and pass it in?
          const start = path.node.loc.start.index;
          // check if the line number of interest is within the start and end lines of the function definition
            if (startingIndex === start) {
              // stop the traversal once we have found the information we are looking for
              // because we are only interested in the first function definition that matches line number
              let newFuncInfo = new FuncObject(path, filePath, code, ast)
              funcInfo = newFuncInfo
              // path.stop();
            }
        }
        
      });
    }
    return funcInfo
  } 

  const finalObj = []

  mergedTree.boundDispatchers.forEach(bd => {
    let newObj = {}
    newObj.routeName = bd.path
    for (const key in bd.endpoints) {
      // newObj.routeName = key
      const methods = bd.endpoints[key].methods
      newObj.routeMethods = {}
      let method = Object.keys(methods)[0]
      newObj.routeMethods[method] = {middlewares : []}
      let middleware = bd.endpoints[key].middlewareChain.middlewareChain
      while (middleware) {
        // console.log(middleware)
        let mwObj = {}
        if (!middleware.isThirdParty) {
          mwObj.functionInfo = {
            funcName : middleware.name,
            funcFile : middleware.filePath,
            funcPosition : [middleware.funcInfo.location.start.index, middleware.funcInfo.location.end.index],
            funcDef : middleware.funcString,
            funcAssignedTo : middleware.funcInfo.assignedTo,
            funcLine : middleware.funcInfo.line,
            isThirdParty : false
          }
          middleware.funcInfo.listDepends()
          middleware.funcInfo.listUpdates()
          middleware.funcInfo.deleteCode()
          mwObj.deps =  {
            upstream : { dependents : middleware.funcInfo.depends || []},
            downstream : { dependents : middleware.funcInfo.updates || []}
          }
        } else {
          mwObj.functionInfo = {
            funcName : middleware.name,
            funcFile : '',
            funcPosition : [0,0],
            funcDef : middleware.funcString,
            funcAssignedTo : '',
            funcLine : [0,0],
            isThirdParty : true
          }
          mwObj.deps = {
            upstream : { dependents : []},
            downstream : { dependents : []}
          }
        }
        // console.log("DEP CHECK")
        // console.log(`${method} ${key} ${mwObj.funcName}`)
        // console.dir(mwObj.deps, {depth : 4})

        newObj.routeMethods[method].middlewares.push(mwObj)
        middleware = middleware.nextFunc
      }

    }
    finalObj.push(newObj)
  })

  // console.log("FINAL OBJECT FOR RETURN", finalObj)



  fs.writeFileSync(
    "./bdTest.json",
    JSON.stringify(finalObj),
    (error) => {
      if (error) throw error;
    }
  );



  res.locals.tree = finalObj;
  next()
}

// const res = {
//   locals : {
//     tree : null
//   }
// }

// const next = () => {}

// mergeDispatchersExport(null, res, next)
// console.log("hi")

module.exports = mergeDispatchersExport