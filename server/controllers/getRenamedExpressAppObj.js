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
    // const expressApp = require("../renamedServer/app.js");
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
            // endpoints": {
            //   "/:id": {
            //       "methods": {
            //           "delete": true
            //       },
            this.listAllBDEndpoints = function (r) {
                //make general endpoint obj
                var endpoints = {};
                // console.log("in list all BOUND DISPATCH endpoints with folloring r:")
                // console.log(r)
                var newMWLL = new middlewareLL(r.route);
                var newEndpoint = {};
                newEndpoint[r.route.path] = {};
                newEndpoint[r.route.path]['methods'] = r.route.methods;
                newEndpoint[r.route.path]['path'] = r.route.path;
                newEndpoint[r.route.path]['stack'] = r.route.stack;
                newEndpoint[r.route.path]['middlewareChain'] = newMWLL;
                // console.log('new BD endpoint')
                // console.log(newEndpoint)
                // r.route.stack.forEach((el) => {
                //   console.log("stackEl", el)
                //   // make endpoint-specific key in obj
                //   endpoints[el?.route?.path] = {};
                //   // make LLs of middleware functions for each specific endpoint
                //   endpoints[el?.route?.path] = new middlewareLL(el.route);
                // });
                // return endpoints;
                return newEndpoint;
            };
            this.path = boundDispatch.route.path;
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
                // console.log("in list all endpoints with folloring r:")
                // console.log(r)
                // const recurseiveStackDive = (parentStack) => {
                //   //if the parent has a stack, log all the children of the stack
                //   if (parentStack?.stack) {
                //     console.log("parentStack exists")
                //     parentStack.stack.forEach(childStack => {
                //       console.log("Child Stack Element:")
                //       console.log(childStack)
                //     })
                //   }
                // }
                // recurseiveStackDive(r)
                // const recursiveStackDive = (root, ogHandle) => {
                //   console.log("root")
                //   console.log(root)
                //   if (root?.handle?.stack || root?.stack) {
                //     let noRouter = true
                //     root.handle.stack.forEach(stackEl => {
                //       if (stackEl.name === 'bound dispatch' || stackEl.name === 'router') {
                //         console.log("bd or router found")
                //         noRouter = false
                //         recursiveStackDive(stackEl, root)
                //       }
                //     })
                //     if (noRouter) {
                //       console.log("root.route.path", root.route.path)
                //       endpoints[root.route.path] = new middlewareLL(root.route);
                //     }
                //   }
                //   //check if there is a stack
                //   //if there not
                //   //if there is
                //     //set a noRouter to true
                //     //iterate through it
                //       //if the el is a router or bound dispatcher
                //         //set noRouter to false
                //         //recursively call this function
                //     //if noRouter is true
                //       //this is a final endppoint, make a mw chain from its stack
                //   // console.log("root")
                //   // console.log(root)
                //   // console.log("root.handle")
                //   // console.log(root.handle)
                //   // console.log("ogHandle")
                //   // console.log(ogHandle)
                //   // root.handle.stack.forEach((el) => {
                //   //   console.log("IN FOR EACH of HANDLE STACK")
                //   //   console.log(el)
                //   //   console.log(el.handle)
                //   //   // console.log(el.handle)
                //   //   //if el does not have a path route
                //   //   if (!el?.route?.path) {
                //   //       //check to see if it is 
                //   //       //recur until it does
                //   //       recursiveStackDive(el, el.handle)
                //   //       // el = el.handle
                //   //       // el.stack.forEach(subEl => {
                //   //       //     console.log(subEl)
                //   //       // }
                //   //   // )
                //   //   } else {
                //   //     //if it does
                //   //     console.log("el.name")
                //   //     console.log(el.name)
                //   //     console.log("el.route?.stack")
                //   //     console.log(el.route?.stack)
                //   //     // make endpoint-specific key in obj
                //   //     endpoints[el.route.path] = {};
                //   //     // make LLs of middleware functions for each specific endpoint
                //   //     endpoints[el.route.path] = new middlewareLL(el.route);
                //   //   }
                //   // })
                // }
                // recursiveStackDive(r, 'NA')
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
                    // console.log(
                    //   `\n Function #${indexInChain} in ${this.path}:`.bold.green,
                    //   `\n ${current.funcString} \n`
                    // );
                    indexInChain++;
                    current = current.nextFunc;
                }
            };
            // console.log("in middlewreLL with subroute:", subRoute)
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
    //pass in a router stack
    var routerRecur = function (router, type) {
        var _a;
        //make a noRouters thign equal to true
        var noRouters = true;
        // console.log("routerREcur with type ", type, " and router :", router)
        if ((_a = router === null || router === void 0 ? void 0 : router.handle) === null || _a === void 0 ? void 0 : _a.stack) {
            //for each element in the router stack
            router.handle.stack.forEach(function (stackEl) {
                //if element is a bound Dispatcher
                if (stackEl.name === 'bound dispatch') {
                    // console.log("founstackEl bd")
                    //update noRouter to false
                    noRouters = false;
                    // routerRecur(stackEl, 'bd')
                    stackEl.route.stack.forEach(function (bdStackEl) {
                        // console.log("bdStackEl:", bdStackEl)
                    });
                    //call boundDisaptcher creator
                    // console.log("bound dispatch router", stackEl)
                    var newBD = new BoundDispatcher(stackEl);
                    console.log(newBD.path, newBD.methods);
                    // console.log("new boudn dispatcher is; ", newBD)
                    appTree.boundDispatchers.push(newBD);
                }
                else if (stackEl.name === 'router') {
                    //if the element is a router
                    //update noRouter to false
                    noRouters = false;
                    //recursively call this function
                    routerRecur(stackEl, 'router');
                }
                if (noRouters) {
                    if (type === 'router') {
                        var newRouter = new Router(router);
                        // console.log('newRouter is ', newRouter);
                        appTree.routers.push(newRouter);
                        console.log(newRouter.path, newRouter.methods);
                    }
                    else if (type === 'bd') {
                        // console.log("bound dispatch router", router)
                        var newBD = new BoundDispatcher(router);
                        // console.log("new boudn dispatcher is; ", newBD)
                        appTree.boundDispatchers.push(newBD);
                        console.log(newBD.path, newBD.methods);
                    }
                }
            });
        }
        else {
            if (type === 'router') {
                var newRouter = new Router(router);
                // console.log('newRouter is ', newRouter);
                appTree.routers.push(newRouter);
                console.log(newRouter.path, newRouter.methods);
            }
            else if (type === 'bd') {
                // console.log("bound dispatch router", router)
                var newBD = new BoundDispatcher(router);
                // console.log("new boudn dispatcher is; ", newBD)
                appTree.boundDispatchers.push(newBD);
                console.log(newBD.path, newBD.methods);
            }
        }
    };
    //if noRouter is true
    //const newRouter: object = new Router(router);
    //console.log('newRouter is ', newRouter);
    //appTree.routers.push(newRouter);
    //pass in an element in a router stack
    //if element is a bound Dispatcher
    //call boundDisaptcher creator
    //if the element is a router
    //recursively call this function
    //if element is neither
    //
    //recur down routers
    // const recursiveStackDive = (parentStack) => {
    // //if the parent has a stack, log all the children of the stack
    // if (parentStack?.stack) {
    //   console.log("parentStack exists")
    //   parentStack.stack.forEach(childStack => {
    //     console.log("Child Stack Element:")
    //     console.log(childStack)
    //   })
    //   }
    // }
    // recursiveStackDive(r)
    // look at the routers stack
    appTree.app._router.stack.forEach(function (router) {
        // console.log('router is ', router);
        // console.log('router name is ', router.name);
        // console.log('router is ', router);
        // if route is a bound dispatcher, create a new boundDispatcher
        if (router.name === "bound dispatch") {
            routerRecur(router, 'bd');
            // console.log("found bound dispatcher")
            // const newBD: object = new BoundDispatcher(router);
            // appTree.boundDispatchers.push(newBD);
        }
        // if the route is a router, create a new router
        if (router.name === "router") {
            routerRecur(router, 'router');
            // console.log("router handle stack:")
            // console.log(router.handle.stack)
            // console.log("router handle stack[0].handle.stack:")
            // console.log(router.handle.stack[0].handle.stack)
            // console.log("router handle stack.[0].handle.stack[0].handle.stack")
            // console.log(router.handle.stack[0].handle.stack[0].handle.stack[0])
            // console.log(router.handle.stack[0].handle.stack[0].handle.stack[1])
            // console.log(router.handle.stack[0].handle.stack[0].handle.stack[2])
            // console.log(router.handle.stack[0].handle.stack[0].handle.stack[3])
            // const newRouter: object = new Router(router);
            // console.log('newRouter is ', newRouter);
            // appTree.routers.push(newRouter);
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
    // console.log('renamedappTree before writeFileSync is ', originalAppTree);
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
