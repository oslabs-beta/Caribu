"use strict";
exports.__esModule = true;
module.exports = function (req, res, next) {
    console.log("IN GET ORIGNIAL EXPRESS APP OBJ");
    //require Express
    var e = require("express");
    var fs = require("fs");
    //**** NEED TO MAKE THIS DYNAMIC ****
    var copiedServer = "../process/copiedServer";
    var expressApp = require(copiedServer + req.body.serverpath.replace(req.body.filepath, ""));
    // const expressApp = require("../copiedServer/app.js");
    // const expressApp = require('../copiedServerNamed/server.js')
    var app = expressApp;
    // console.log('app is ', app)
    // console.log('expressApp is ', expressApp)
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
        function BoundDispatcher(boundDispatch) {
            this.path = "";
            this.bd = {};
            this.methods = null;
            this.stack = [];
            this.path = boundDispatch.route.path;
            this.bd = boundDispatch;
            this.methods = boundDispatch.route.methods;
            this.stack = boundDispatch.route.stack;
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
                var recursiveStackDive = function (root, ogHandle) {
                    console.log("root");
                    console.log(root);
                    console.log("root.handle");
                    console.log(root.handle);
                    console.log("ogHandle");
                    console.log(ogHandle);
                    root.handle.stack.forEach(function (el) {
                        var _a, _b, _c;
                        console.log("IN FOR EACH of HANDLE STACK");
                        console.log(el);
                        console.log(el.handle);
                        // console.log(el.handle)
                        if (((_a = el === null || el === void 0 ? void 0 : el.route) === null || _a === void 0 ? void 0 : _a.stack.length) === 1) {
                            endpoints[el.route.path] = {};
                            endpoints[el.route.path] = new middlewareLL(el.route);
                        }
                        else if (!((_b = el === null || el === void 0 ? void 0 : el.route) === null || _b === void 0 ? void 0 : _b.path)) {
                            recursiveStackDive(el, el.handle);
                            // el = el.handle
                            // el.stack.forEach(subEl => {
                            //     console.log(subEl)
                            // }
                            // )
                        }
                        else {
                            console.log("el.name");
                            console.log(el.name);
                            console.log("el.route?.stack");
                            console.log((_c = el.route) === null || _c === void 0 ? void 0 : _c.stack);
                            // make endpoint-specific key in obj
                            endpoints[el.route.path] = {};
                            // make LLs of middleware functions for each specific endpoint
                            endpoints[el.route.path] = new middlewareLL(el.route);
                        }
                    });
                };
                recursiveStackDive(r, 'NA');
                // r.handle.stack.forEach((el) => {
                //   // make endpoint-specific key in obj
                //   endpoints[el.route.path] = {};
                //   // make LLs of middleware functions for each specific endpoint
                //   endpoints[el.route.path] = new middlewareLL(el.route);
                // });
                // return
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
                    console.log("\n Function #".concat(indexInChain, " in ").concat(_this.path, ":").bold.green, "\n ".concat(current.funcString, " \n"));
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
    // look at the routers stack
    appTree.app._router.stack.forEach(function (router) {
        // console.log('router is ', router);
        console.log('router name is ', router.name);
        // if route is a bound dispatcher, create a new boundDispatcher
        if (router.name === "bound dispatch") {
            var newBD = new BoundDispatcher(router);
            appTree.boundDispatchers.push(newBD);
        }
        // if the route is a router, create a new router
        if (router.name === "router") {
            var newRouter = new Router(router);
            console.log('newRouter is ', newRouter);
            appTree.routers.push(newRouter);
        }
    });
    // //no apptree.boundDispatchers yet
    // // console.log(appTree);
    // appTree.routers.forEach((el) => {
    //   for (let endpoint in el.endpoints) {
    //     // console.log(el.endpoints[endpoint].stack)
    //     // console.log("THIS IS ENDPOINT: ", endpoint);
    //     // console.log("THIS IS ENDPOINT MW STACK: ", el.endpoints[endpoint].stack);
    //   }
    //   // // el.endpoints.forEach(elEnd => {
    //   //   console.log(elEnd.middlewareChain)
    //   // })
    // });
    var originalAppTree = appTree;
    console.log('appTree before writeFileSync is ', originalAppTree);
    fs.writeFileSync("originalAppTree.json", JSON.stringify(originalAppTree), function (error) {
        if (error)
            throw error;
    });
    // setTimeout(() => next(), 5000)
    next();
    //
};
