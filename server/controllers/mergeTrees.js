var mergeTreesExport = function (req, res, next) {
    var originalTree = require('../originalAppTree.json');
    var renamedTree = require('../renamedAppTree.json');
    var fs = require('fs');
    var parser = require('@babel/parser');
    var parse = require('@babel/core').parse;
    var traverse = require('@babel/traverse')["default"];
    var isGeneratorFunction = require('util/types').isGeneratorFunction;
    var fileVars = {};
    var FuncObject = (function () {
        function FuncObject(path, filePath, code, ast) {
            this.path = path;
            this.filePath = filePath;
            this.globalVars = this.listGlobals(ast, code, filePath);
            this.funcName = this.funcLabel(path) || "anonymous_function_at_".concat(path.node.start, "-").concat(path.node.end, "_in_").concat(filePath);
            this.params = this.listParams(path, filePath);
            this.declares = this.listDeclares(path, filePath, code);
            this.returns = this.listReturns(path, code);
            this.depends = {};
            this.updates = {};
            this.location = path.node.loc;
            this.allVars = this.listAllVars;
        }
        FuncObject.prototype.listGlobals = function (ast, code, filePath) {
            if (!fileVars[filePath]) {
                fileVars[filePath] = {
                    globalDeclarations: {},
                    functionLevelDeclarations: []
                };
            }
            ast.program.body.forEach(function (bodyNode) {
                if (bodyNode.type === 'VariableDeclaration') {
                    bodyNode.declarations.forEach(function (declaration) {
                        var declarationObj = {};
                        declarationObj.declaredName = declaration.id.name;
                        declarationObj.type = bodyNode.kind;
                        declarationObj.definition = code.slice(bodyNode.start, bodyNode.end);
                        declarationObj.position = [bodyNode.start, bodyNode.end];
                        fileVars[filePath].globalDeclarations[declaration.id.name] = declarationObj;
                    });
                }
            });
        };
        FuncObject.prototype.funcLabel = function (path) {
            var _a;
            return ((_a = path.node.id) === null || _a === void 0 ? void 0 : _a.name) || false;
        };
        FuncObject.prototype.listParams = function (path, filePath) {
            var paramArr = [];
            path.scope.block.params.forEach(function (el) { return paramArr.push(el.name); });
            return paramArr;
        };
        FuncObject.prototype.listUpdates = function () {
            var path = this.path;
            var filePath = this.filePath;
            var code = fs.readFileSync(filePath).toString();
            var funcName = this.funcName;
            var updatesArr = [];
            function findOriginalDeclaration(varName, filePath, funcName) {
                var originalDeclaration = false;
                for (var declaration in fileVars[filePath].globalDeclarations) {
                    if (declaration.declaredName === varName) {
                        originalDeclaration = declaration;
                    }
                }
                var varNotAlreadyDeclared = true;
                fileVars[filePath].functionLevelDeclarations.forEach(function (declaration) {
                    if (funcName === declaration.funcName) {
                        varNotAlreadyDeclared = false;
                    }
                });
                if (varNotAlreadyDeclared) {
                    fileVars[filePath].functionLevelDeclarations.forEach(function (declaration) {
                        if (declaration.declaredName === varName) {
                            originalDeclaration = declaration;
                        }
                    });
                }
                return originalDeclaration;
            }
            var assignmentChecker = {
                AssignmentExpression: function (path) {
                    var newUpdateObj = {
                        dependentFuncName: '',
                        dependentFuncFile: '',
                        dependentFuncPosition: [],
                        dependentFuncDef: '',
                        updateName: '',
                        updateType: 'AssignmentExpression',
                        updateDefinition: '',
                        updatePosition: [],
                        originallyDeclared: false
                    };
                    if (path.node.left.type === 'MemberExpression') {
                        newUpdateObj.dependentFuncName = newUpdateObj.updateName = code.slice(path.node.left.start, path.node.left.end);
                        newUpdateObj.dependentFuncDef = newUpdateObj.updateDefinition = code.slice(path.node.start, path.node.end);
                        newUpdateObj.dependentFuncPosition = newUpdateObj.updatePosition = [path.node.start, path.node.end];
                        newUpdateObj.originallyDeclared = findOriginalDeclaration(newUpdateObj.updateName, filePath);
                    }
                    if (path.node.left.type === 'Identifier') {
                        newUpdateObj.dependentFuncName = newUpdateObj.updateName = path.node.left.name;
                        newUpdateObj.dependentFuncDef = newUpdateObj.updateDefinition = code.slice(path.node.start, path.node.end);
                        newUpdateObj.dependentFuncPosition = newUpdateObj.updatePosition = [path.node.start, path.node.end];
                        newUpdateObj.originallyDeclared = findOriginalDeclaration(newUpdateObj.updateName, filePath);
                    }
                    if (newUpdateObj.originallyDeclared) {
                        updatesArr.push(newUpdateObj);
                    }
                    else {
                    }
                }
            };
            var updateChecker = {
                UpdateExpression: function (path) {
                    var newUpdateObj = {
                        dependentFuncName: '',
                        dependentFuncFile: '',
                        dependentFuncPosition: [],
                        dependentFuncDef: '',
                        updateName: '',
                        updateType: 'UpdateExpression',
                        updateDefinition: '',
                        updatePosition: [],
                        originallyDeclared: false
                    };
                    if (path.node.argument === 'MemberExpression') {
                        newUpdateObj.dependentFuncName = newUpdateObj.updateName = code.slice(path.node.argument.start, path.node.argument.end);
                        newUpdateObj.dependentFuncDef = newUpdateObj.updateDefinition = code.slice(path.node.start, path.node.end);
                        newUpdateObj.dependentFuncPosition = newUpdateObj.updatePosition = [path.node.start, path.node.end];
                        newUpdateObj.originallyDeclared = findOriginalDeclaration(newUpdateObj.updateName, filePath);
                    }
                    if (path.node.argument === 'Identifier') {
                        newUpdateObj.dependentFuncName = newUpdateObj.updateName = path.node.argument.name;
                        newUpdateObj.dependentFuncDef = newUpdateObj.updateDefinition = code.slice(path.node.start, path.node.end);
                        newUpdateObj.dependentFuncPosition = newUpdateObj.updatePosition = [path.node.start, path.node.end];
                        newUpdateObj.originallyDeclared = findOriginalDeclaration(newUpdateObj.updateName, filePath);
                    }
                    if (newUpdateObj.originallyDeclared) {
                        updatesArr.push(newUpdateObj);
                    }
                    else {
                    }
                }
            };
            path.traverse(assignmentChecker);
            path.traverse(updateChecker);
            this.updates = updatesArr;
        };
        FuncObject.prototype.listDeclares = function (path, filePath, code) {
            var funcName = this.funcName;
            var declaresArr = [];
            var nestedVisitor = {
                VariableDeclaration: function (path) {
                    path.node.declarations.forEach(function (declaration) {
                        var declarationObj = {};
                        declarationObj.funcName = funcName;
                        declarationObj.declaredName = declaration.id.name;
                        declarationObj.type = path.node.kind;
                        declarationObj.definition = code.slice(path.node.start, path.node.end);
                        declarationObj.filePath = filePath;
                        declarationObj.position = [path.node.start, path.node.end];
                        declaresArr.push(declarationObj);
                    });
                }
            };
            path.traverse(nestedVisitor);
            fileVars[filePath].functionLevelDeclarations = declaresArr;
            return declaresArr;
        };
        FuncObject.prototype.listDepends = function () {
            var path = this.path;
            var filePath = this.filePath;
            var code = fs.readFileSync(filePath).toString();
            var funcName = this.funcName;
            var dependsList = [];
            function findOriginalDeclaration(varName, filePath, funcName) {
                var originalDeclaration = false;
                for (var declaration in fileVars[filePath].globalDeclarations) {
                    if (declaration.declaredName === varName) {
                        originalDeclaration = declaration;
                    }
                }
                var varNotAlreadyDeclared = true;
                fileVars[filePath].functionLevelDeclarations.forEach(function (declaration) {
                    if (funcName === declaration.funcName) {
                        varNotAlreadyDeclared = false;
                    }
                });
                if (varNotAlreadyDeclared) {
                    fileVars[filePath].functionLevelDeclarations.forEach(function (declaration) {
                        if (declaration.declaredName === varName) {
                            originalDeclaration = declaration;
                        }
                    });
                }
                return originalDeclaration;
            }
            path.traverse({
                Identifier: function (path) {
                    if (path.parent.type !== 'MemberExpression' && path.parent.type !== 'UpdateExpression' && path.parent.type !== 'AssignmentExpression') {
                        var originalDeclaration = findOriginalDeclaration(path.node.name, filePath, funcName);
                        if (originalDeclaration) {
                            var dependsVar = {
                                upVarName: path.node.name,
                                upVarFile: filePath,
                                upVarPosition: [path.node.start, path.node.end],
                                location: [path.node.start, path.node.end],
                                originalDeclaration: originalDeclaration
                            };
                            dependsList.push(dependsVar);
                        }
                    }
                }
            });
            this.depends = dependsList;
        };
        FuncObject.prototype.listReturns = function (path, code) {
            console.log(path);
            var returnVal = [];
            if (path.node.body.type === 'CallExpression') {
                returnVal.push(code.slice(path.node.body.start, path.node.body.end));
                return returnVal;
            }
            path.node.body.body.forEach(function (bodyNode) {
                if (bodyNode.type === 'ReturnStatement') {
                    returnVal.push(bodyNode.argument.name);
                }
            });
            return returnVal;
        };
        FuncObject.prototype.deletePath = function () {
            delete this.path;
        };
        return FuncObject;
    }());
    function info(tree) {
        console.log('**** TREE.ROUTERS **** {object}');
        console.log('**** TREE.ROUTERS **** [array]');
        console.log('**** TREE.ROUTERS.STACK **** [array]');
        console.log('**** TREE.ROUTERS.STACK[i].endpoints{}.stack **** {obj}');
    }
    function isolateNumbers(string) {
        var startIndex = string.indexOf('CBUSTART') + 8;
        var numbers = '';
        for (var i = startIndex; i < string.length; i++) {
            if (!isNaN(string[i])) {
                numbers += string[i];
            }
            else {
                break;
            }
        }
        console.log("NUMBERS: ", numbers);
        return numbers;
    }
    function isolatePath(string) {
        var startIndex = string.indexOf('CBUPATH') + 7;
        var slicedString = string.slice(startIndex);
        console.log("orignal path from name", slicedString);
        var parsedPath = slicedString.replaceAll('$', '/').replaceAll('_', '.').replaceAll('Ü', '-');
        console.log("cleaned path from name", parsedPath);
        return parsedPath;
    }
    function isolateType(string) {
        var nameStart = string.indexOf('CBUTYPE_') + 8;
        var firstUnder = string.indexOf('_', nameStart + 12);
        var funcType = string.slice(nameStart, firstUnder);
        return funcType;
    }
    function mergeTrees(oldTree, renamedTree) {
        for (var routerNum = 0; routerNum < oldTree.routers.length; routerNum++) {
            for (var endpoint in oldTree.routers[routerNum].endpoints) {
                console.log('ENDPOINT', oldTree.routers[routerNum].endpoints[endpoint]);
                console.log('RENAMED ENDPOINT VVVVVVVVV');
                console.log('RENAMED ENDPOINT', renamedTree.routers[routerNum].endpoints[endpoint]);
                var currentMw = oldTree.routers[routerNum].endpoints[endpoint]['middlewareChain'];
                var matchingMw = renamedTree.routers[routerNum].endpoints[endpoint]['middlewareChain'];
                while (currentMw) {
                    currentMw.name = matchingMw.name;
                    currentMw.type = isolateType(currentMw.name);
                    currentMw.startingPosition = parseInt(isolateNumbers(currentMw.name));
                    currentMw.filePath = "/" + isolatePath(currentMw.name);
                    currentMw.funcInfo = getFuncInfo(currentMw.filePath, currentMw.startingPosition, currentMw.type);
                    currentMw = currentMw.nextFunc;
                    matchingMw = matchingMw.nextFunc;
                }
            }
        }
        return oldTree;
    }
    var mergedTree = mergeTrees(originalTree, renamedTree);
    function getFuncInfo(filePath, startingIndex, funcType) {
        var code = fs.readFileSync(filePath).toString();
        var funcInfo = null;
        var ast = parser.parse(code);
        if (funcType === 'FUNCTIONDECLARATION') {
            traverse(ast, {
                FunctionDeclaration: function (path) {
                    var start = path.node.loc.start.index;
                    if (startingIndex === start) {
                        var newFuncInfo = new FuncObject(path, filePath, code, ast);
                        funcInfo = newFuncInfo;
                    }
                }
            });
        }
        if (funcType === 'FUNCTIONEXPRESSION') {
            traverse(ast, {
                FunctionExpression: function (path) {
                    var start = path.node.loc.start.index;
                    if (startingIndex === start) {
                        var newFuncInfo = new FuncObject(path, filePath, code, ast);
                        funcInfo = newFuncInfo;
                    }
                }
            });
        }
        if (funcType === 'ARROWFUNCTION') {
            traverse(ast, {
                ArrowFunctionExpression: function (path) {
                    var start = path.node.loc.start.index;
                    if (startingIndex === start) {
                        var newFuncInfo = new FuncObject(path, filePath, code, ast);
                        funcInfo = newFuncInfo;
                    }
                }
            });
        }
        return funcInfo;
    }
    var finalObj = [];
    mergedTree.routers.forEach(function (route) {
        for (var endpoint in route.endpoints) {
            var routeObj = {};
            var endpointPath = route.endpoints[endpoint].path;
            var endpointMethod = Object.keys(route.endpoints[endpoint].methods)[0];
            if (!routeObj[endpointPath]) {
                routeObj.routeName = endpointPath;
                routeObj.routeMethods = {};
                routeObj.routeMethods[endpointMethod] = {};
            }
            routeObj.routeMethods[endpointMethod].middlewares = [];
            var current = route.endpoints[endpoint].middlewareChain;
            while (current) {
                current.funcInfo.listUpdates();
                current.funcInfo.listDepends();
                current.funcInfo.deletePath();
                routeObj.routeMethods[endpointMethod].middlewares.push(current);
                current = current.nextFunc;
            }
            finalObj.push(routeObj);
        }
    });
    finalObj.forEach(function (route) {
        var methodObj = route.routeMethods;
        var _loop_1 = function (method) {
            var oneMethod = methodObj[method];
            oneMethod.middlewares.forEach(function (middleware, i) {
                var newObj = {};
                newObj.functionInfo = {
                    funcName: middleware.name,
                    funcFile: middleware.filePath,
                    funcPosition: [middleware.funcInfo.location.start.index, middleware.funcInfo.location.end.index],
                    funcDef: middleware.funcString
                };
                console.log(middleware.funcInfo.depends);
                newObj.deps = {
                    upstream: { dependents: middleware.funcInfo.depends || [] },
                    downstream: { dependents: middleware.funcInfo.updates || [] }
                };
                route.routeMethods[method].middlewares[i] = newObj;
                console.log('NEW OBJ IN ROUTE: ', method);
                console.log('IN FUNC: ', middleware.name);
            });
        };
        for (var method in methodObj) {
            _loop_1(method);
        }
    });
    res.locals.tree = finalObj;
    next();
};
module.exports = mergeTreesExport;
