"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const REFVItem_1 = __importDefault(require("./REFVItem"));
const react_redux_1 = require("react-redux");
function REFunctionViewer(props) {
    const routes = (0, react_redux_1.useSelector)((state) => state.views.routes);
    const routeIndex = (0, react_redux_1.useSelector)((state) => state.views.routeIndex);
    const method = (0, react_redux_1.useSelector)((state) => state.views.curMethod);
    console.log(method);
    const functions = [];
    if (method) {
        const middlewares = routes[routeIndex].routeMethods[method].middlewares;
        for (let i = 0; i < middlewares.length; i++) {
            functions.push(<REFVItem_1.default middleware={middlewares[i]}/>);
            console.log(middlewares[i].functionInfo.funcName);
        }
    }
    return (<div>
      <span className='refv-header'>Functions</span>
      {functions}
    </div>);
}
exports.default = REFunctionViewer;
