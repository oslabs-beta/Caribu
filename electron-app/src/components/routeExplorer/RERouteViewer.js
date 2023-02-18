"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const RERVItem_1 = __importDefault(require("./RERVItem"));
function RERouteViewer(props) {
    const routes = (0, react_redux_1.useSelector)((state) => state.views.routes); // routes is an array of objects
    const routeItems = [];
    for (let i = 0; i < routes.length; i++) {
        const name = routes[i].routeName;
        const methods = Object.keys(routes[i].routeMethods);
        for (let j = 0; j < methods.length; j++)
            routeItems.push(<RERVItem_1.default method={methods[j]} name={name} index={i}/>);
    }
    return (<div>
        <span className='rerv-header'>Routes</span>
        {routeItems}
      </div>);
}
exports.default = RERouteViewer;
