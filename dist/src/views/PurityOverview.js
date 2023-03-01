"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_redux_1 = require("react-redux");
const POContainer_1 = __importDefault(require("../components/purityOverview/POContainer"));
// Node, find, union, and addroute are all a data structure used for the union find algorithm aka Disjoint set union.
class Node {
    constructor(value, route) {
        this.val = value;
        this.parent = this;
        this.routes = new Set([route]);
        this.functions = new Set([value]);
    }
}
function find(x) {
    if (x.parent === x) {
        return x;
    }
    else {
        x.parent = find(x.parent);
        return x.parent;
    }
}
function union(x, y) {
    if (find(x) === find(y))
        return;
    else {
        const routes = new Set([...x.parent.routes, ...y.parent.routes]);
        const functions = new Set([...x.parent.functions, ...y.parent.functions]);
        find(y).parent = find(x);
        x.parent.routes = routes;
        x.parent.functions = functions;
    }
}
function addRoute(x, route) {
    find(x).routes.add(route);
}
const Purity = () => {
    // gets routes from the state object.
    const routes = (0, react_redux_1.useSelector)((state) => state.views.routes);
    //This function parses through the routes object to isolate the middlewares down to an object with routename, method, and functionname.
    function parseRoutes() {
        const routesDict = {};
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            routesDict[route.routeName] = {};
            for (const key in route.routeMethods) {
                const middlewares = route.routeMethods[key].middlewares;
                routesDict[route.routeName][key] = [];
                for (let j = 0; j < middlewares.length; j++) {
                    routesDict[route.routeName][key].push(middlewares[j].functionInfo.funcName);
                }
            }
        }
        return routesDict;
    }
    // function to generate the containers for each route where routes are grouped by shared middlewares function.
    function generateContainers() {
        // reduces the route object again to an object with routes: functions only.
        function isolateRouteFunctions() {
            const isoFuncs = {};
            for (const key in reducedRoutes) {
                if (!isoFuncs[key])
                    isoFuncs[key] = new Set();
                for (const key2 in reducedRoutes[key]) {
                    const methodFuncs = reducedRoutes[key][key2];
                    for (let i = 0; i < methodFuncs.length; i++)
                        isoFuncs[key].add(reducedRoutes[key][key2][i]);
                }
            }
            return isoFuncs;
        }
        // groups routes together along with their functions to allow for separation of related components.
        function groupSharedMiddlewares(isoFuncs) {
            // 
            function processRoutes(routes) {
                for (const route of routes) {
                    const groups = getGroupsFromRoute(route);
                    joinGroups(groups);
                    addData(find(groups[0]), route);
                }
            }
            // Uses find to determine which routes are related.
            function getGroupsFromRoute(route) {
                const funcs = isoFuncs[route];
                return [...funcs].map(f => find(allFuncs[f]));
            }
            // Unions each node to make all related nodes point to one parent.
            function joinGroups(groups) {
                for (let i = 0; i < groups.length - 1; i++) {
                    union(groups[i], groups[i + 1]);
                }
            }
            // This function goes up the union links and makes the node add its own function to the parent nodes list of functions. Set prevents duplicates in the parent function list.
            function addData(x, route) {
                x.parent.routes.add(route);
                x.parent.functions = new Set([...x.parent.functions, ...isoFuncs[route]]);
            }
            function getUniqueGroups(groups) {
                return [...new Set(groups.map(x => find(x)))];
            }
            // Gets all the functions into a set. 
            const allFuncs = {};
            for (const key in isoFuncs) {
                isoFuncs[key].forEach((el) => allFuncs[el] = new Node(el, key));
            }
            processRoutes(Object.keys(isoFuncs));
            const groups = getUniqueGroups(Object.values(allFuncs));
            return groups;
        }
        // routes object to => { routes: { methods : [functions] } }
        const reducedRoutes = parseRoutes();
        // reducedRoutes object to => {routes: Set(functions) }
        const isoFuncs = isolateRouteFunctions();
        // sharedMiddlewares is a set with Node objects that contain their unique shared route lists and related functions.
        const sharedMiddlewares = groupSharedMiddlewares(isoFuncs);
        console.log('shared', sharedMiddlewares);
        const containers = [];
        // pushes each individual container with props for its route, sharedroutes and functions
        for (let i = 0; i < sharedMiddlewares.length; i++) {
            containers.push((0, jsx_runtime_1.jsx)(POContainer_1.default, { reducedRoutes: reducedRoutes, sharedRoutes: sharedMiddlewares[i].routes, functions: sharedMiddlewares[i].functions }));
        }
        return containers;
    }
    const containers = generateContainers();
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "po-main" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "po-header" }, { children: "Route dependency Breakdowns" })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "po-containers" }, { children: containers }))] })));
};
// containers need to be generated on a for loop based on back end responses.
exports.default = Purity;
//# sourceMappingURL=PurityOverview.js.map