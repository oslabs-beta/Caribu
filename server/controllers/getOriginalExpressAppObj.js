module.exports = function (req, res, next) {
    console.log("IN GET ORIGNIAL EXPRESS APP OBJ");
    //require Express
    var e = require("express");
    var fs = require("fs");
    //**** NEED TO MAKE THIS DYNAMIC ****
    const {copiedServer} = require('./serverDirPaths')
    // var expressApp = require(copiedServer+'/server.js');
    var expressApp = require(copiedServer+'/app.js');
    // const expressApp = require('../copiedServerNamed/server.js')
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
                r.handle.stack.forEach(function (el) {
                    // make endpoint-specific key in obj
                    endpoints[el.route.path] = {};
                    // make LLs of middleware functions for each specific endpoint
                    endpoints[el.route.path] = new middlewareLL(el.route);
                });
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
        // if route is a bound dispatcher, create a new boundDispatcher
        if (router.name === "bound dispatch") {
            var newBD = new BoundDispatcher(router);
            appTree.boundDispatchers.push(newBD);
        }
        // if the route is a router, create a new router
        if (router.name === "router") {
            var newRouter = new Router(router);
            appTree.routers.push(newRouter);
        }
    });
    // console.log(appTree);
    appTree.routers.forEach(function (el) {
        // console.log(
        //   "************************************************************************************************************"
        // );
        // console.log(el)
        // console.log(el.endpoints)
        for (var endpoint in el.endpoints) {
            // console.log(el.endpoints[endpoint].stack)
            // console.log("THIS IS ENDPOINT: ", endpoint);
            // console.log("THIS IS ENDPOINT MW STACK: ", el.endpoints[endpoint].stack);
        }
        // // el.endpoints.forEach(elEnd => {
        //   console.log(elEnd.middlewareChain)
        // })
    });
    var originalAppTree = appTree;
    fs.writeFileSync("originalAppTree.json", JSON.stringify(originalAppTree), function (error) {
        if (error)
            throw error;
    });
    next();
    //
};
