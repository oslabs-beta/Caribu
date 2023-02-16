import { useSelector } from "react-redux";
import { RootState } from "../store";
import POContainer from "../components/purityOverview/POContainer";
import { ReactElement } from "react";

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


const Purity = (props: object) => {

  const routes = useSelector((state: RootState) => state.views.routes);

  function parseRoutes(){
    const routesDict: object= {};

    //This function parses through the routes object to isolte the middlewares down to an object with routename, method, and functionname.

    for(let i = 0; i < routes.length; i++){
      const route: object = routes[i]
      routesDict[route.routeName] = {};
      
      for(const key in route.routeMethods){
        const middlewares = route.routeMethods[key].middlewares;
        routesDict[route.routeName][key] = [];
        for(let j = 0; j < middlewares.length; j++){
          routesDict[route.routeName][key].push(middlewares[j].functionInfo.funcName);
        }
      }
    }
    return routesDict;
  }

  function generateContainers(){

    function isolateRouteFunctions(){
      const isoFuncs: object = {};
      for(const key in reducedRoutes){
        if(!isoFuncs[key]) isoFuncs[key] = new Set();
        for(const key2 in reducedRoutes[key]){
          const methodFuncs = reducedRoutes[key][key2]
          for(let i = 0; i < methodFuncs.length; i++) isoFuncs[key].add(reducedRoutes[key][key2][i]);
        }
      }
      return isoFuncs;
    }

    function groupSharedMiddlewares(isoFuncs: object){

      function getGroupsFromRoute(route: string): Node[]{
        const funcs = isoFuncs[route];
        return [...funcs].map(f => find(allFuncs[f]));
      }

      function joinGroups(groups: Node[]): void {
        for(let i = 0; i < groups.length - 1; i++) {
          union(groups[i], groups[i + 1]);
        }
      }

      function addData(x: Node, route: string): void {
        x.parent.routes.add(route);
        x.parent.functions = new Set([...x.parent.functions, ...isoFuncs[route]]);
      }

      function processRoutes(routes: string[]){
        for(const route of routes){
          const groups = getGroupsFromRoute(route);
          joinGroups(groups);
          addData(find(groups[0]), route);
        }
      }

      function getUniqueGroups(groups: Node[]) {

      return [...new Set(groups.map(x => find(x)))]
      }


      // get all the functions into a set. This can be used to confirm 
      const allFuncs: object = {};
      for (const key in isoFuncs){
        isoFuncs[key].forEach((el: string) => allFuncs[el] = new Node(el, key));
      }

      processRoutes(Object.keys(isoFuncs));

      const groups = getUniqueGroups(Object.values(allFuncs));
      
      return groups;
    }

    const reducedRoutes = parseRoutes();
    const isoFuncs: object = isolateRouteFunctions();
    const sharedMiddlewares: Array<Node> = groupSharedMiddlewares(isoFuncs);
    console.log('shared', sharedMiddlewares);

    const containers: ReactElement[] = [];

    for(let i = 0; i < sharedMiddlewares.length; i++){
      console.log(sharedMiddlewares[i].routes);
      console.log(sharedMiddlewares[i].functions);
      containers.push(
        <POContainer reducedRoutes={reducedRoutes} sharedRoutes={sharedMiddlewares[i].routes} functions={sharedMiddlewares[i].functions}/>
      );
    }
    return containers;
  }

  const containers = generateContainers();

  return (
    <div className="po-main">
      <div className="po-header">
        Route dependency Breakdowns
      </div>
      <div className="po-containers">
        {containers}
      </div>
    </div>
  );
}

// containers need to be generated on a for loop based on back end responses.

export default Purity;