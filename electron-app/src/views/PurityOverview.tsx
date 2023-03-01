import { useSelector } from "react-redux";
import { RootState } from "../store";
import POContainer from "../components/purityOverview/POContainer";
import { ReactElement } from "react";
import e from "express";
import { convertRoutesToDataRoutes } from "@remix-run/router/dist/utils";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import cariboxStyling from "../components/caribox";

const newCariboxStyling = {...cariboxStyling, minHeight : '5vh', width: '80vw'}
import {Navigate, useLocation} from "react-router-dom"



// Node, find, union, and addroute are all a data structure used for the union find algorithm aka Disjoint set union.
class Node {
  val: string;
  parent: Node;
  routes: Set<string>;
  functions: Set<string>;
  
  constructor(value: string, route: string){
    this.val = value;
    this.parent = this;
    this.routes = new Set([route]);
    this.functions = new Set([value]);
  }
}

function find(x: Node): Node{
  if(x.parent === x){
    return x;
  } else {
    x.parent = find(x.parent);
    return x.parent;
  }
}

function union(x: Node, y: Node): void{
  if(find(x) === find(y)) return;
  else {
    const routes = new Set([...x.parent.routes, ...y.parent.routes]);
    const functions = new Set([...x.parent.functions, ...y.parent.functions]);
    find(y).parent = find(x);
    x.parent.routes = routes;
    x.parent.functions = functions;
  }
}

function addRoute(x: Node, route: string): void{
  find(x).routes.add(route);
}


const Purity = () => {

// gets routes from the state object.
const routes = useSelector((state: RootState) => state.views.routes);
const views = useSelector((state: RootState) => state.views);

if(!views.directoryProcessed) {
  console.log("USER NOT PROCESSED")
  return <Navigate to="/"/>
}

const funcLibrary = {}

//This function parses through the routes object to isolate the middlewares down to an object with routename, method, and functionname.
function parseRoutes(strs: string[] = ['']){
  strs = strs.filter((el) => el.length);

  const routesDict: object= {};
  for(let i = 0; i < routes.length; i++){
    const route: object = routes[i];
    if(!routesDict[route.routeName]) routesDict[route.routeName] = {};
    
    for(const key in route.routeMethods){
      const middlewares = route.routeMethods[key].middlewares;
      routesDict[route.routeName][key] = [];
      // if string is in function name at all, be sure to skip over that function.
      // assume it comes from a value in the store.
      // if string not provided, leave string empty
      // be sure to make sure that string.length is > 0 for the includes method in this.
      // think of maybe maing it an array of string for multiple options.
      for(let j = 0; j < middlewares.length; j++){
        const funcName = middlewares[j].functionInfo.funcName;
        if(strs.map((el: string) => funcName.toLowerCase().includes(el.toLowerCase())).reduce((acc: boolean, el: boolean) => el || acc, false)) continue;
        if(middlewares[j].functionInfo.funcAssignedTo)
          if(strs.map((el: string) => middlewares[j].functionInfo.funcAssignedTo.toLowerCase().includes(el.toLowerCase())).reduce((acc: boolean, el: boolean) => el || acc, false)) continue;
        if (!funcLibrary[funcName]) {
          funcLibrary[funcName] = middlewares[j].functionInfo
        }
        routesDict[route.routeName][key].push(middlewares[j].functionInfo.funcName);
      }
      if(routesDict[route.routeName][key].length === 0) delete routesDict[route.routeName][key];
    }
    if(Object.keys(routesDict[route.routeName]).length === 0) delete routesDict[route.routeName];
  }
  console.log("routesDict", routesDict)
  return routesDict;
}


// function to generate the containers for each route where routes are grouped by shared middlewares function.
function generateContainers(){


  // reduces the route object again to an object with routes: functions only.
  function isolateRouteFunctions(){
    const isoFuncs: object = {};
    for(const key in reducedRoutes){
      if(!isoFuncs[key]) isoFuncs[key] = new Set();
      for(const key2 in reducedRoutes[key]){
        const methodFuncs = reducedRoutes[key][key2]
        for(let i = 0; i < methodFuncs.length; i++) {
          isoFuncs[key].add(reducedRoutes[key][key2][i])
        };
      }
    }
    return isoFuncs;
  }

  // groups routes together along with their functions to allow for separation of related components.
  function groupSharedMiddlewares(isoFuncs: object){

    // 
    function processRoutes(routes: string[]){
      for(const route of routes){
        const groups = getGroupsFromRoute(route);
        joinGroups(groups);
        addData(find(groups[0]), route);
      }
    }

    // Uses find to determine which routes are related.
    function getGroupsFromRoute(route: string): Node[]{
      const funcs = isoFuncs[route];
      return [...funcs].map(f => find(allFuncs[f]));
    }

    // Unions each node to make all related nodes point to one parent.
    function joinGroups(groups: Node[]): void {
      for(let i = 0; i < groups.length - 1; i++) {
        union(groups[i], groups[i + 1]);
      }
    }

    // This function goes up the union links and makes the node add its own function to the parent nodes list of functions. Set prevents duplicates in the parent function list.
    function addData(x: Node, route: string): void {
      x.parent.routes.add(route);
      x.parent.functions = new Set([...x.parent.functions, ...isoFuncs[route]]);
    }

    function getUniqueGroups(groups: Node[]) {
      return [...new Set(groups.map(x => find(x)))]
    }


    // Gets all the functions into a set. 
    const allFuncs: object = {};
    for (const key in isoFuncs){
      isoFuncs[key].forEach((el: string) => allFuncs[el] = new Node(el, key));
    }

    processRoutes(Object.keys(isoFuncs));

    const groups = getUniqueGroups(Object.values(allFuncs));
    
    return groups;
  }

  // routes object to => { routes: { methods : [functions] } }
  console.log(routes)
  const reducedRoutes = parseRoutes();
  console.log('reducedRoutes', reducedRoutes)

  // reducedRoutes object to => {routes: Set(functions) }
  const isoFuncs: object = isolateRouteFunctions();
  console.log('isofuncs', isoFuncs)

  // sharedMiddlewares is a set with Node objects that contain their unique shared route lists and related functions.
  const sharedMiddlewares: Array<Node> = groupSharedMiddlewares(isoFuncs);
  sharedMiddlewares.sort((a, b) => {b.routes.size - a.routes.size})
  console.log('shared', sharedMiddlewares);

  const containers: ReactElement[] = [];

  // pushes each individual container with props for its route, sharedroutes and functions
  for(let i = 0; i < sharedMiddlewares.length; i++){
    console.log('HSAREd I:', sharedMiddlewares[i], reducedRoutes)
    let listOfRoutes = ''
    
    sharedMiddlewares[i].routes.forEach(el => {listOfRoutes += `${el}, `})
    listOfRoutes = listOfRoutes.slice(0, listOfRoutes.length-2)

    containers.push(
      <div>
      <Accordion style={newCariboxStyling}>
      <AccordionSummary>
        <div>
        <b>{`Group ${i+1}:`} <i>{listOfRoutes}</i></b>  
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <POContainer funcLibrary={funcLibrary} reducedRoutes={reducedRoutes} sharedRoutes={sharedMiddlewares[i].routes} functions={sharedMiddlewares[i].functions}/>
      </AccordionDetails>
      </Accordion>
      <br/>
      </div>
    );
  }
  return containers;
}

const containers = generateContainers();

  return (
  <div style={{display : 'flex', flexDirection : 'column' , alignItems : 'center', color : '#F1EDE0', marginTop : '5%'}}>

      <h1 >Purity Overview</h1>
      <div>
        {containers}
      </div>
    </div>
  );
}

// containers need to be generated on a for loop based on back end responses.

export default Purity;