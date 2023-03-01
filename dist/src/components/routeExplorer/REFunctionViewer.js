"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const REFVItem_1 = __importDefault(require("./REFVItem"));
const react_redux_1 = require("react-redux");
function REFunctionViewer(props) {
    // imports the routes object, current method selected, and the route index from the redux state.
    const routes = (0, react_redux_1.useSelector)((state) => state.views.routes);
    const routeIndex = (0, react_redux_1.useSelector)((state) => state.views.routeIndex);
    const method = (0, react_redux_1.useSelector)((state) => state.views.curMethod);
    const functions = [];
    // if there is a method in the state, it sets the middlewares to the currently selected methods middleswares and passes the middlewares as props to a REFVITem component
    if (method) {
        const middlewares = routes[routeIndex].routeMethods[method].middlewares;
        for (let i = 0; i < middlewares.length; i++) {
            functions.push((0, jsx_runtime_1.jsx)(REFVItem_1.default, { middleware: middlewares[i] }));
        }
    }
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ className: 'refv-header' }, { children: "Functions" })), functions] }));
}
exports.default = REFunctionViewer;
//# sourceMappingURL=REFunctionViewer.js.map