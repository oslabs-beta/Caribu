//require Express
const e = require('express')

//add color to terminal output
const colors = require('colors') // this is

//Diff server testing (I threw `module.exports = app` at the bottom of each of these when I was testing)
const catApp = require('./server')
// const starWarsApp = require('../../cs/juniorUnits/unit-10-databases/server/server')
// const expressApp = require('../../cs/juniorUnits/unit-9-express/server/server')


//app switcher for easy switching between apps. 
const appSwitcher = []

if (typeof catApp !== 'undefined') appSwitcher.push(catApp)
if (typeof starWarsApp !== 'undefined') appSwitcher.push(starWarsApp)
if (typeof expressApp !== 'undefined') appSwitcher.push(expressApp)

const app = appSwitcher[0]

//NODES NEEDED

// CLASS DEFINITIONS
// APP TREE
// Beginning of tree, this holds the entirety of the app and initializes empty arrays for the routers and bound dispatchers (explained below)
class AppTree {
  constructor(app) {
    this.app = app
    this.routers = []
    this.boundDispatchers = []
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
  constructor(bd) {
    this.path = bd.route.path
    this.bd = bd
    this.methods = bd.route.methods
    this.stack = bd.route.stack
  }
}

// ROUTER
// a router is a router that the app uses for handling requests to a certain route
// 
// file: server.js
// // app.use('/topLevelRoute', apiRouter)
class Router {
  constructor(router) {
    this.pathRegex = router.regexp
    this.endpoints = this.listAllEndpoints(router)
    this.router = router
    this.stack = router.handle.stack
  }

  // This method creates an object of endpoints and their associated middleware
  // it does not yet handle multiple methods for the same route (eg. GET and POST), but should be simple to implement
  listAllEndpoints = (r) => {
    //make general endpoint obj
    const endpoints = {}
    r.handle.stack.forEach(el => {
      // make endpoint-specific key in obj
      endpoints[el.route.path] = {}
      // make LLs of middleware functions for each specific endpoint
      endpoints[el.route.path] = new middlewareLL(el.route)
    })
    // return 
    return endpoints
  }
}

// MIDDLEWARE LINKED LIST
// Stores a bunch of general info about the route as well as the start of the middleware chain
// Also has methods for creating the LL out of the submitted route's stack and a callable method to log every LL node
class middlewareLL {
  constructor(subRoute) {
    //this method is HTTP method, not js method
    this.methods = subRoute.methods
    //this is currently always indefined
    this.path = subRoute.path
    this.stack = subRoute.stack
    // this is basically the head node
    this.middlewareChain = this.makeMiddlewareChain(subRoute.stack)
  }

  // This method iterates through the "stack" (which holds all the middleware functions in an array) and makes them into middleware nodes 
  makeMiddlewareChain = (stack) => {
    //make sure stack exists
    if (stack.length) {
      //make the first node
      const firstNode = new middlewareLLNode(stack[0])
      //iterate through the stack, adding middleware nodes to the chain
      let curr = firstNode
      for (let i = 1; i < stack.length; i++) {
        curr.nextFunc = new middlewareLLNode(stack[i])
        curr = curr.nextFunc
      }
      return firstNode
    }
  }

  // this function, when invoked, iterates through the LL to list out all the functions definitions in the middleware chain
  listMiddlewareFuncs = () => {
    // start at head
    let current = this.middlewareChain
    // set an index
    let indexInChain = 0
    // iterate through ll and log the fucnction position, route, and function definition
    while (current) {
      console.log(`\n Function #${indexInChain} in ${this.path}:`.bold.green, `\n ${current.funcString} \n`)
      indexInChain++
      current = current.nextFunc
    }
  }
}

// MIDDLEWARE NODE
// Basic LL node constructor
class middlewareLLNode {
  constructor(func) {
    this.func = func.handle
    // this is undefined, ideally it would hold the path of the file that holds the function
    this.path = func.handle.file
    this.funcString = func.handle.toString()
    // this will get reassigned if it is not the last LL node
    this.nextFunc = null
  }
}

// create app node
const appTree = new AppTree(app)
// look at the routers stack
appTree.app._router.stack.forEach(router => {
  // if route is a bound dispatcher, create a new boundDispatcher
  if (router.name === 'bound dispatch') {
    const newBD = new BoundDispatcher(router)
    appTree.boundDispatchers.push(newBD)
  }
  // if the route is a router, create a new router
  if (router.name === 'router') {
    const newRouter = new Router(router)
    appTree.routers.push(newRouter)
  }
})

// ASSORTED TESTING ETC
// These are me trying to play around with how to get certain info out of it

// Access a specific endpoint's routes like this:
// appTree.routers[0].endpoints['PATH_OF_ENDPOINT'].listMiddlewareFuncs()
// for example, this works for my cat thing:
appTree.routers[0].endpoints['/:catId'].listMiddlewareFuncs()
//
// note:
// this doesn't work by iterating through `appTree.routers[0].endpoints` with a for of/in loop. No idea why.

// console.log('\n\n', appTree.boundDispatchers, '\n\n')
// console.log('\n\n', appTree.routers[0].endpoints, '\n\n')
// console.log('\n\n', appTree.routers[0].endpoints['/:catId'].listMiddlewareFuncs, '\n\n')
// console.log('\n\n', appTree.routers[0].endpoints['/:catId'].middlewareChain, '\n\n')
// console.log('\n\n', appTree.routers[0].endpoints['/:catId'].stack[0], '\n\n')
// console.log('\n\n', appTree.routers[0], '\n\n')
appTree.routers[0].endpoints['/:catId'].listMiddlewareFuncs()
console.log(appTree.routers[0].endpoints['/:catId'])
// appTree.routers[0].endpoints['/'].listMiddlewareFuncs()

// const endpoints = Object.keys(appTree.routers[0].endpoints)
// endpoints.forEach(ep => {
//   console.log("\n +++++++++++++++++++++++++++++++++++++++++++++++++++++ \n middlewareChain for route ", ep)
//   appTree.routers[0].endpoints[ep].listMiddlewareFuncs()
//   console.log("\n +++++++++++++++++++++++++++++++++++++++++++++++++++++")
// })






// get the stack of functions that the App uses for routing
app._router.stack.forEach(function(middleware){
  //if it is not a direct route 
  //if it is a ROUTER and not just a direct route
  //eg. app.use('/api', apiRouter) vs. app.get('/') => { res.sendStatus(400) }
  if(middleware.name === 'router'){ // router middleware 
    //log it
    console.log('\n\nMIDDLEWARE: \n')
    console.log(middleware)
    
    //log the different sub-routes 
    console.log('\n\nMIDDLEWARE HANDLERS STACK: \n')
    middleware.handle.stack.forEach(el => {console.log(el.route.path)})

    //for each subroute, list the associated function definitons
    //limited to just the /locations route for ease -of reasing
    // middleware.handle.stack.forEach(function(handler){
    //   // if (handler.route.path === '/locations/') {
    //     // console.log(`\n\n SPECIFIC STACK ROUTE '${handler.route.path}': \n`)
        
    //     //log the stack for the specific route
    //     // console.log(handler.route)
        
    //     //list every function definition
    //     console.log(`\n\n FUNCTION DEFINTIONS IN ROUTE ${handler.route.path}: \n`)
    //       handler.route.stack.forEach(el => {
    //         console.log(el.handle.toString(), '\n')
    //       })
    //     }
  }
})