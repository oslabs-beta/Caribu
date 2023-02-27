import { Express } from 'express';

const getOriginalObjExport = (req, res, next) => {
  console.log("IN GET ORIGNIAL EXPRESS APP OBJ");
  //require Express
  const e = require("express");
  const fs = require("fs");
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
    constructor(boundDispatch: object) {
      this.path = boundDispatch.route.path;
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
      console.log("in list all BOUND DISPATCH endpoints with folloring r:")
      console.log(r)

      let newMWLL = new middlewareLL(r.route)
      const newEndpoint = {}
      newEndpoint[r.route.path] = {}
      newEndpoint[r.route.path]['methods'] = r.route.methods
      newEndpoint[r.route.path]['path'] = r.route.path
      newEndpoint[r.route.path]['stack'] = r.route.stack
      newEndpoint[r.route.path]['middlewareChain'] = newMWLL
      
      console.log('new BD endpoint')
      console.log(newEndpoint)
      // r.route.stack.forEach((el) => {
      //   console.log("stackEl", el)
      //   // make endpoint-specific key in obj
      //   endpoints[el?.route?.path] = {};
      //   // make LLs of middleware functions for each specific endpoint
      //   endpoints[el?.route?.path] = new middlewareLL(el.route);
      // });
      // return endpoints;
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
      console.log("in list all endpoints with folloring r:")
      console.log(r)

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
      console.log("in middlewreLL with subroute:", subRoute)
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
        console.log(
          `\n Function #${indexInChain} in ${this.path}:`.bold.green,
          `\n ${current.funcString} \n`
        );
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


  //pass in a router stack
  const routerRecur = (router, type) => {
    //make a noRouters thign equal to true
    let noRouters = true

    console.log("routerREcur with type ", type, " and router :", router)
    if (router?.handle?.stack) {
      //for each element in the router stack
      router.handle.stack.forEach(stackEl => {
        //if element is a bound Dispatcher
        if (stackEl.name === 'bound dispatch') {
          console.log("founstackEl bd")
          //update noRouter to false
          noRouters = false        
          // routerRecur(stackEl, 'bd')
          stackEl.route.stack.forEach(bdStackEl => {
            console.log("bdStackEl:", bdStackEl)
          })
          //call boundDisaptcher creator
          console.log("bound dispatch router", stackEl)
          const newBD: object = new BoundDispatcher(stackEl);
          console.log("new boudn dispatcher is; ", newBD)
          appTree.boundDispatchers.push(newBD);
        } else if (stackEl.name === 'router') {
          //if the element is a router
          //update noRouter to false
          noRouters = false
          //recursively call this function
          routerRecur(stackEl, 'router')
        }
        if (noRouters) {
          if (type === 'router') {
            const newRouter: object = new Router(router);
            console.log('newRouter is ', newRouter);
            appTree.routers.push(newRouter);
          } else if (type === 'bd') {
            console.log("bound dispatch router", router)
            const newBD: object = new BoundDispatcher(router);
            console.log("new boudn dispatcher is; ", newBD)
            appTree.boundDispatchers.push(newBD);
          }
        }
      })
    } else {
      if (type === 'router') {
        const newRouter: object = new Router(router);
        console.log('newRouter is ', newRouter);
        appTree.routers.push(newRouter);
      } else if (type === 'bd') {
        console.log("bound dispatch router", router)
        const newBD: object = new BoundDispatcher(router);
        console.log("new boudn dispatcher is; ", newBD)
        appTree.boundDispatchers.push(newBD);
      }
    }
  }
  
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
  appTree.app._router.stack.forEach((router) => {
    // console.log('router is ', router);
    // console.log('router name is ', router.name);
    // console.log('router is ', router);
    // if route is a bound dispatcher, create a new boundDispatcher
    if (router.name === "bound dispatch") {
      routerRecur(router, 'bd')
      // console.log("found bound dispatcher")
      // const newBD: object = new BoundDispatcher(router);
      // appTree.boundDispatchers.push(newBD);
    }
    // if the route is a router, create a new router
    if (router.name === "router") {
      routerRecur(router, 'router')
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
  const originalAppTree = appTree;
  // console.log('appTree before writeFileSync is ', originalAppTree);
  fs.writeFileSync(
    "originalAppTree.json",
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