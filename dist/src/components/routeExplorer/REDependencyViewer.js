"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_redux_1 = require("react-redux");
const REDVItem_1 = __importDefault(require("./REDVItem"));
function REDependencyViewer(props) {
    // get state for routes, currently selected middleware.
    const routes = (0, react_redux_1.useSelector)((state) => state.views.routes);
    const middleware = (0, react_redux_1.useSelector)((state) => state.views.curMiddleware);
    // assign depency tree to a variable for easier reference in code.
    const dependencyTree = middleware.deps;
    // creates a list for upstream and downstream dependencies.
    const uDependencies = [];
    const dDependencies = [];
    // checks if upstream depencies exists
    if (dependencyTree) {
        // usptream iterator: generates a component for each upstream dependency passing in the dependency name and path as props
        for (let i = 0; i < dependencyTree.upstream.length; i++) {
            uDependencies.push((0, jsx_runtime_1.jsx)(REDVItem_1.default, { upVarName: dependencyTree.upstream[i].upVarName, upVarPath: dependencyTree.upstream[i].upVarFile }));
        }
        // downstream iterator: generates a component for each downstream dependency passing in the dependency name and path as props
        for (let i = 0; i < dependencyTree.downstream.dependents.length; i++) {
            dDependencies.push((0, jsx_runtime_1.jsx)(REDVItem_1.default, { depVarName: dependencyTree.downstream.dependents[i].dependentFuncName, depVarPath: dependencyTree.downstream.dependents[i].dependentFuncFile }));
        }
    }
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ className: 'redv-header' }, { children: "Dependencies" })), uDependencies, dDependencies] }));
}
exports.default = REDependencyViewer;
//# sourceMappingURL=REDependencyViewer.js.map