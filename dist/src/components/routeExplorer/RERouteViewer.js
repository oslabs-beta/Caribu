"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_redux_1 = require("react-redux");
const RERVItem_1 = __importDefault(require("./RERVItem"));
function RERouteViewer() {
    // grabs the route object from the redux state
    const routes = (0, react_redux_1.useSelector)((state) => state.views.routes); // routes is an array of objects
    console.log('RERouteViewer routes state is ', routes);
    console.log('RERouteViewer routes.length is ', routes.length);
    const routeItems = [];
    for (let i = 0; i < routes.length; i++) {
        const name = routes[i].routeName;
        console.log('RERouteViewer routes state name is ', name);
        const methods = Object.keys(routes[i].routeMethods);
        console.log('RERouteViewer routes state methods is ', methods);
        for (let j = 0; j < methods.length; j++)
            routeItems.push((0, jsx_runtime_1.jsx)(RERVItem_1.default, { method: methods[j], name: name, index: i }, name + i));
    }
    console.log('RERouteViewer routeItems after loop is ', routeItems);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ className: 'rerv-header' }, { children: "Routes" })), routeItems] }));
}
exports.default = RERouteViewer;
//# sourceMappingURL=RERouteViewer.js.map