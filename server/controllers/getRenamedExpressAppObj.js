"use strict";
exports.__esModule = true;
var getRenamedObjExport = function (req, res, next) {
    console.log("IN GET RENAMED EXPRESS APP OBJ");
    //require Express
    var e = require("express");
    var fs = require("fs");
    //**** NEED TO MAKE THIS DYNAMIC ****
    var renamedServer = "../process/renamedServer";
    var expressApp = require(renamedServer + req.body.serverpath.replace(req.body.filepath, ""));
    var app = expressApp;
    //NODES NEEDED
    // CLASS DEFINITIONS
    // APP TREE
    // Beginning of tree, this holds the entirety of the app and initializes empty arrays for the routers and bound dispatchers (explained below)
    var AppTree = /** @class */ (function () {
        function AppTree(app) {
            this.app = app;
            this.routers = [];
            this.boundDispatchers = [];
        }
        return AppTree;
    }());
    // BOUND DISPATCHER
    // a bound dispatcher is a simple route
    //
    // file: server.js
    // // app.get('/topLevelRoute', (req, res) => {
    // //   res.status(200).json({message : "hello!"})
    // // })
    // //
    var BoundDispatcher = /** @class */ (function () {
        function BoundDispatcher(boundDispatch, fullPath) {
            this.path = "";
            this.bd = {};
            this.methods = null;
            this.stack = [];
            // endpoints": {
            //   "/:id": {
            //       "methods": {
            //           "delete": true
            //       },
            this.listAllBDEndpoints = function (r) {
                //make general endpoint obj
                var endpoints = {};
                var newMWLL = new middlewareLL(r.route);
                var newEndpoint = {};
                newEndpoint[r.route.path] = {};
                newEndpoint[r.route.path]['methods'] = r.route.methods;
                newEndpoint[r.route.path]['path'] = r.route.path;
                newEndpoint[r.route.path]['stack'] = r.route.stack;
                newEndpoint[r.route.path]['middlewareChain'] = newMWLL;
                return newEndpoint;
            };
            // this.path = boundDispatch.route.path;
            this.path = fullPath || '/';
            this.router = boundDispatch;
            this.methods = boundDispatch.route.methods;
            this.stack = boundDispatch.route.stack;
            this.endpoints = this.listAllBDEndpoints(boundDispatch);
        }
        return BoundDispatcher;
    }());
    // ROUTER
    // a router is a router that the app uses for handling requests to a certain route
    //
    // file: server.js
    // // app.use('/topLevelRoute', apiRouter)
    var Router = /** @class */ (function () {
        function Router(router) {
            // This method creates an object of endpoints and their associated middleware
            // it does not yet handle multiple methods for the same route (eg. GET and POST), but should be simple to implement
            this.listAllEndpoints = function (r) {
                //make general endpoint obj
                var endpoints = {};
                r.handle.stack.forEach(function (el) {
                    var _a, _b;
                    // make endpoint-specific key in obj
                    endpoints[(_a = el === null || el === void 0 ? void 0 : el.route) === null || _a === void 0 ? void 0 : _a.path] = {};
                    // make LLs of middleware functions for each specific endpoint
                    endpoints[(_b = el === null || el === void 0 ? void 0 : el.route) === null || _b === void 0 ? void 0 : _b.path] = new middlewareLL(el.route);
                });
                return endpoints;
            };
            this.pathRegex = router.regexp;
            this.endpoints = this.listAllEndpoints(router);
            this.router = router;
            this.stack = router.handle.stack;
        }
        return Router;
    }());
    // MIDDLEWARE LINKED LIST
    // Stores a bunch of general info about the route as well as the start of the middleware chain
    // Also has methods for creating the LL out of the submitted route's stack and a callable method to log every LL node
    var middlewareLL = /** @class */ (function () {
        function middlewareLL(subRoute) {
            var _this = this;
            // This method iterates through the "stack" (which holds all the middleware functions in an array) and makes them into middleware nodes
            this.makeMiddlewareChain = function (stack) {
                //make sure stack exists
                if (stack.length) {
                    //make the first node
                    var firstNode = new middlewareLLNode(stack[0]);
                    //iterate through the stack, adding middleware nodes to the chain
                    var curr = firstNode;
                    for (var i = 1; i < stack.length; i++) {
                        curr.nextFunc = new middlewareLLNode(stack[i]);
                        curr = curr.nextFunc;
                    }
                    return firstNode;
                }
                else
                    return {};
            };
            // this function, when invoked, iterates through the LL to list out all the functions definitions in the middleware chain
            this.listMiddlewareFuncs = function () {
                // start at head
                var current = _this.middlewareChain;
                // set an index
                var indexInChain = 0;
                // iterate through ll and log the fucnction position, route, and function definition
                while (current) {
                    indexInChain++;
                    current = current.nextFunc;
                }
            };
            //this method is HTTP method, not js method
            this.methods = subRoute.methods;
            //this is currently always indefined
            this.path = subRoute.path;
            this.stack = subRoute.stack;
            // this is basically the head node
            this.middlewareChain = this.makeMiddlewareChain(subRoute.stack);
        }
        return middlewareLL;
    }());
    // MIDDLEWARE NODE
    // Basic LL node constructor
    var middlewareLLNode = /** @class */ (function () {
        function middlewareLLNode(func) {
            this.func = func.handle;
            // this is undefined, ideally it would hold the path of the file that holds the function
            this.path = func.handle.file;
            this.funcString = func.handle.toString();
            // this will get reassigned if it is not the last LL node
            this.nextFunc = null;
        }
        return middlewareLLNode;
    }());
    // create app node
    var appTree = new AppTree(app);
    var dispatcherArr = [];
    var regexToPath = function (regex) {
        var newArr = regex.split('');
        var filteredArr = newArr.filter(function (el) { return el.toUpperCase() !== el.toLowerCase() || el === ":"; });
        return filteredArr.join('');
    };
    //pass in a router stack
    var routerRecur = function (router, type, path) {
        var _a;
        if (path === void 0) { path = ''; }
        //make a noRouters thign equal to true
        var noRouters = true;
        var regexPath = '';
        var newPath = path;
        if ((router === null || router === void 0 ? void 0 : router.regexp) && path.length === 0) {
            regexPath = regexToPath(router.regexp.source);
            newPath = "".concat(path, "/").concat(regexPath, "/");
        }
        if ((_a = router === null || router === void 0 ? void 0 : router.handle) === null || _a === void 0 ? void 0 : _a.stack) {
            //for each element in the router stack
            router.handle.stack.forEach(function (stackEl) {
                //if element is a bound Dispatcher
                if (stackEl.name === 'bound dispatch') {
                    //update noRouter to false
                    noRouters = false;
                    // routerRecur(stackEl, 'bd')
                    stackEl.route.stack.forEach(function (bdStackEl) {
                    });
                    //call boundDisaptcher creator
                    // console.log("regexPath", regexPath)
                    // console.log("newPath", newPath)
                    // console.log("stackEl.route.path", stackEl.route.path)
                    var bdPath = "".concat(newPath, "/").concat(stackEl.route.path, "/");
                    // console.log(bdPath.indexOf('//'))
                    while (bdPath.indexOf('//') >= 0) {
                        // console.log(bdPath)
                        bdPath = bdPath.replace('//', '/');
                    }
                    // console.log("new bd path********************************************************************\n", bdPath)
                    var newBD = new BoundDispatcher(stackEl, bdPath);
                    appTree.boundDispatchers.push(newBD);
                    dispatcherArr.push(newBD);
                }
                else if (stackEl.name === 'router') {
                    //if the element is a router
                    //update noRouter to false
                    noRouters = false;
                    //recursively call this function
                    routerRecur(stackEl, 'router', newPath);
                }
                if (noRouters) {
                    if (type === 'router') {
                        var newRouter = new Router(router);
                        appTree.routers.push(newRouter);
                        // console.log(newRouter.path, newRouter.methods)
                    }
                    else if (type === 'bd') {
                        var newBD = new BoundDispatcher(router);
                        appTree.boundDispatchers.push(newBD);
                        dispatcherArr.push(newBD);
                    }
                }
            });
        }
        else {
            if (type === 'router') {
                var newRouter = new Router(router);
                appTree.routers.push(newRouter);
            }
            else if (type === 'bd') {
                var newBD = new BoundDispatcher(router);
                appTree.boundDispatchers.push(newBD);
                dispatcherArr.push(newBD);
            }
        }
    };
    // look at the routers stack
    appTree.app._router.stack.forEach(function (router) {
        // if route is a bound dispatcher, create a new boundDispatcher
        if (router.name === "bound dispatch") {
            routerRecur(router, 'bd');
        }
        // if the route is a router, create a new router
        if (router.name === "router") {
            routerRecur(router, 'router');
        }
    });
    var originalAppTree = appTree;
    fs.writeFileSync("renamedAppTree.json", JSON.stringify(originalAppTree), function (error) {
        if (error)
            throw error;
    });
    next();
    //
};
// const req = {
//   body : {
//     "filepath" : "/Users/morry/git/node-express-realworld-example-app",
//     "nodepath" : "/Users/morry/git/node-express-realworld-example-app/node_modules",
//     "serverpath" : "/Users/morry/git/node-express-realworld-example-app/app.js"
//   }
// }
// getRenamedObjExport(req, null, () => {})
module.exports = getRenamedObjExport;
