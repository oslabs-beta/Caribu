"use strict";
exports.__esModule = true;
module.exports = function (req, res, next) {
    console.log("IN GET ORIGNIAL EXPRESS APP OBJ");
    var e = require("express");
    var fs = require("fs");
    var copiedServer = "../process/copiedServer";
    var expressApp = require(copiedServer + req.body.serverpath.replace(req.body.filepath, ""));
    var app = expressApp;
    var AppTree = (function () {
        function AppTree(app) {
            this.app = app;
            this.routers = [];
            this.boundDispatchers = [];
        }
        return AppTree;
    }());
    var BoundDispatcher = (function () {
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
    var Router = (function () {
        function Router(router) {
            this.listAllEndpoints = function (r) {
                var endpoints = {};
                r.handle.stack.forEach(function (el) {
                    endpoints[el.route.path] = {};
                    endpoints[el.route.path] = new middlewareLL(el.route);
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
    var middlewareLL = (function () {
        function middlewareLL(subRoute) {
            var _this = this;
            this.makeMiddlewareChain = function (stack) {
                if (stack.length) {
                    var firstNode = new middlewareLLNode(stack[0]);
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
            this.listMiddlewareFuncs = function () {
                var current = _this.middlewareChain;
                var indexInChain = 0;
                while (current) {
                    console.log("\n Function #".concat(indexInChain, " in ").concat(_this.path, ":").bold.green, "\n ".concat(current.funcString, " \n"));
                    indexInChain++;
                    current = current.nextFunc;
                }
            };
            this.methods = subRoute.methods;
            this.path = subRoute.path;
            this.stack = subRoute.stack;
            this.middlewareChain = this.makeMiddlewareChain(subRoute.stack);
        }
        return middlewareLL;
    }());
    var middlewareLLNode = (function () {
        function middlewareLLNode(func) {
            this.func = func.handle;
            this.path = func.handle.file;
            this.funcString = func.handle.toString();
            this.nextFunc = null;
        }
        return middlewareLLNode;
    }());
    var appTree = new AppTree(app);
    appTree.app._router.stack.forEach(function (router) {
        console.log('router name is ', router.name);
        if (router.name === "bound dispatch") {
            var newBD = new BoundDispatcher(router);
            appTree.boundDispatchers.push(newBD);
        }
        if (router.name === "router") {
            var newRouter = new Router(router);
            console.log('newRouter is ', newRouter);
            appTree.routers.push(newRouter);
        }
    });
    var originalAppTree = appTree;
    console.log('appTree before writeFileSync is ', originalAppTree);
    fs.writeFileSync("originalAppTree.json", JSON.stringify(originalAppTree), function (error) {
        if (error)
            throw error;
    });
    next();
};
