import { Express } from 'express';

const getOriginalObjExport = (req, res, next) => {
  console.log("IN GET ORIGNIAL EXPRESS APP OBJ");
  //require Express
  const e = require("express");
  const fs = require("fs");
  const { appTreeFolder } = require("./serverDirPaths");
  const path = require('path');
  //**** NEED TO MAKE THIS DYNAMIC ****
  const copiedServer = "../process/copiedServer";
  const expressApp: Express = require(copiedServer + req.body.serverpath.replace(req.body.filepath, ""));
  // const expressApp = require("../copiedServer/app.js");
  // const expressApp = require('../copiedServerNamed/server.js')


    const app: Express = expressApp;

  //NODES NEEDED

  // CLASS DEFINITIONS
  // APP TREE
  // Beginning of tree, this holds the entirety of the app and initializes empty arrays for the routers and bound dispatchers (explained below)
  class AppTree {
    app: Express;
    routers: any[];
    boundDispatchers: any[];
    constructor(app: object) {
      this.app = app;
      this.routers = [];
      this.boundDispatchers = [];
    }
  }

  // BOUND DISPATCHER
  // a bound dispatcher is a simple route
  //
  // file: server.js
  // // app.get('/topLevelRoute', (req, res) => {
  // //   res.status(200).json({message : "hello!"})
  // // })
  // //
  class BoundDispatcher {
    path: string = "";
    bd: object = {};
    methods: any = null;
    stack: any[] = [];
    endpoints : any;
    constructor(boundDispatch: object, fullPath: string) {
      // this.path = boundDispatch.route.path;
      this.path = fullPath || '/';
      this.router = boundDispatch;
      this.methods = boundDispatch.route.methods;
      this.stack = boundDispatch.route.stack;
      this.endpoints = this.listAllBDEndpoints(boundDispatch)
    }


    // endpoints": {
    //   "/:id": {
    //       "methods": {
    //           "delete": true
    //       },

    listAllBDEndpoints = (r: object) => {
      //make general endpoint obj
      const endpoints = {};

      let newMWLL = new middlewareLL(r.route)
      const newEndpoint = {}
      newEndpoint[r.route.path] = {}
      newEndpoint[r.route.path]['methods'] = r.route.methods
      newEndpoint[r.route.path]['path'] = r.route.path
      newEndpoint[r.route.path]['stack'] = r.route.stack
      newEndpoint[r.route.path]['middlewareChain'] = newMWLL

      return newEndpoint
    };
  }

  // ROUTER
  // a router is a router that the app uses for handling requests to a certain route
  //
  // file: server.js
  // // app.use('/topLevelRoute', apiRouter)
  class Router {
    pathRegex: string;
    endpoints: object;
    router: object;
    stack: object[];
    constructor(router: object) {
      this.pathRegex = router.regexp;
      this.endpoints = this.listAllEndpoints(router);
      this.router = router;
      this.stack = router.handle.stack;
    }

    // This method creates an object of endpoints and their associated middleware
    // it does not yet handle multiple methods for the same route (eg. GET and POST), but should be simple to implement
    listAllEndpoints = (r: object) => {
      //make general endpoint obj
      const endpoints = {};



      r.handle.stack.forEach((el) => {
        // make endpoint-specific key in obj
        endpoints[el?.route?.path] = {};
        // make LLs of middleware functions for each specific endpoint
        endpoints[el?.route?.path] = new middlewareLL(el.route);
      });
      return endpoints;
    };
  }

  // MIDDLEWARE LINKED LIST
  // Stores a bunch of general info about the route as well as the start of the middleware chain
  // Also has methods for creating the LL out of the submitted route's stack and a callable method to log every LL node
  class middlewareLL {
    methods: any;
    path: string;
    stack: any[];
    middlewareChain: object;
    constructor(subRoute: object, ) {
      //this method is HTTP method, not js method
      this.methods = subRoute.methods;
      //this is currently always indefined
      this.path = subRoute.path;
      this.stack = subRoute.stack;
      // this is basically the head node
      this.middlewareChain = this.makeMiddlewareChain(subRoute.stack);
    }

    // This method iterates through the "stack" (which holds all the middleware functions in an array) and makes them into middleware nodes
    makeMiddlewareChain = (stack: any[]): object => {
      //make sure stack exists
      if (stack.length) {
        //make the first node
        const firstNode: object = new middlewareLLNode(stack[0]);
        //iterate through the stack, adding middleware nodes to the chain
        let curr: any = firstNode;
        for (let i = 1; i < stack.length; i++) {
          curr.nextFunc = new middlewareLLNode(stack[i]);
          curr = curr.nextFunc;
        }
        return firstNode;
      } else return {};
    };

    // this function, when invoked, iterates through the LL to list out all the functions definitions in the middleware chain
    listMiddlewareFuncs = () => {
      // start at head
      let current: object = this.middlewareChain;
      // set an index
      let indexInChain: number = 0;
      // iterate through ll and log the fucnction position, route, and function definition
      while (current) {
        indexInChain++;
        current = current.nextFunc;
      }
    };
  }

  // MIDDLEWARE NODE
  // Basic LL node constructor
  class middlewareLLNode {
    func: any;
    path: string;
    funcString: string;
    nextFunc: any;
    constructor(func: object) {
      this.func = func.handle;
      // this is undefined, ideally it would hold the path of the file that holds the function
      this.path = func.handle.file;
      this.funcString = func.handle.toString();
      // this will get reassigned if it is not the last LL node
      this.nextFunc = null;
    }
  }

  // create app node
  const appTree: AppTree = new AppTree(app);
  const dispatcherArr: object[] = []

const regexToPath = (regex) => {
    const newArr = regex.split('')
    let filteredArr = newArr.filter(el => el.toUpperCase() !== el.toLowerCase() || el === ":")
    return filteredArr.join('')
}
//pass in a router stack
const routerRecur = (router, type, path = '') => {
  //make a noRouters thign equal to true
  let noRouters = true
  let regexPath = ''
  let newPath = path
  if (router?.regexp && path.length === 0) {
    regexPath = regexToPath(router.regexp.source)
    newPath = `${path}/${regexPath}/`
  }
  if (router?.handle?.stack) {
    //for each element in the router stack
    router.handle.stack.forEach(stackEl => {

      
      //if element is a bound Dispatcher
      if (stackEl.name === 'bound dispatch') {
        //update noRouter to false
        noRouters = false        
        // routerRecur(stackEl, 'bd')
        stackEl.route.stack.forEach(bdStackEl => {
        })
        //call boundDisaptcher creator
        // console.log("regexPath", regexPath)
        // console.log("newPath", newPath)
        // console.log("stackEl.route.path", stackEl.route.path)
        let bdPath = `${newPath}/${stackEl.route.path}/`
        // console.log(bdPath.indexOf('//'))
        while (bdPath.indexOf('//') >= 0) {
          // console.log(bdPath)
          bdPath = bdPath.replace('//', '/')
        }
        // console.log("new bd path********************************************************************\n", bdPath)
        const newBD: object = new BoundDispatcher(stackEl, bdPath);
        appTree.boundDispatchers.push(newBD);
        dispatcherArr.push(newBD)
      } else if (stackEl.name === 'router') {
        //if the element is a router
        //update noRouter to false
        noRouters = false
        //recursively call this function
        routerRecur(stackEl, 'router', newPath)
      }
      if (noRouters) {
        if (type === 'router') {
          const newRouter: object = new Router(router);
          appTree.routers.push(newRouter);
          // console.log(newRouter.path, newRouter.methods)
        } else if (type === 'bd') {
          const newBD: object = new BoundDispatcher(router);
          appTree.boundDispatchers.push(newBD);
          dispatcherArr.push(newBD)
        }
      }
    })
  } else {
    if (type === 'router') {
      const newRouter: object = new Router(router);
      appTree.routers.push(newRouter);
    } else if (type === 'bd') {
      const newBD: object = new BoundDispatcher(router);
      appTree.boundDispatchers.push(newBD);
      dispatcherArr.push(newBD)
    }
  }
}

  // look at the routers stack
  appTree.app._router.stack.forEach((router) => {

    // if route is a bound dispatcher, create a new boundDispatcher
    if (router.name === "bound dispatch") {
      routerRecur(router, 'bd')
    }
    // if the route is a router, create a new router
    if (router.name === "router") {
      routerRecur(router, 'router')
    }
  });

<<<<<<< HEAD
=======
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

  //clear out any existing copied server
  if (fs.existsSync(appTreeFolder)) {
    fs.rmSync(appTreeFolder, { recursive: true, force: true });
  }
  //make a new one
  fs.mkdirSync(appTreeFolder);

>>>>>>> dev
  const originalAppTree = appTree;
  // console.log('renamedappTree before writeFileSync is ', originalAppTree);
  // console.log('appTree before writeFileSync is ', originalAppTree);
  fs.writeFileSync(
    path.join(__dirname, "../process/appTrees/originalAppTree.json"),
    JSON.stringify(originalAppTree),
    (error) => {
      if (error) throw error;
    }
  );
  // setTimeout(() => next(), 5000)
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

// getOriginalObjExport(req, null, () => {})

module.exports = getOriginalObjExport