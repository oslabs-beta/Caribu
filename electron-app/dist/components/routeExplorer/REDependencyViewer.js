"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_redux_1 = require("react-redux");
const REDVItem_1 = __importDefault(require("./REDVItem"));
const caribox_1 = __importDefault(require("../caribox"));
function REDependencyViewer() {
    // get state for routes, currently selected middleware.
    // const routes = useSelector((state: RootState) => state.views.routes);
    const middleware = (0, react_redux_1.useSelector)((state) => state.views.curMiddleware);
    console.log(middleware);
    // assign depency tree to a variable for easier reference in code.
    const dependencyTree = middleware.deps;
    // creates a list for upstream and downstream dependencies.
    const uDependencies = [];
    const dDependencies = [];
    const dependencySet = new Set();
    // checks if upstream depencies exists
    if (dependencyTree) {
        if (dependencyTree.upstream.dependents.length) {
            // usptream iterator: generates a component for each upstream dependency passing in the dependency name and path as props
            for (let i = 0; i < dependencyTree.upstream.dependents.length; i++) {
                if (!dependencySet.has(dependencyTree.upstream.dependents[i].upVarName)) {
                    uDependencies.push((0, jsx_runtime_1.jsx)(REDVItem_1.default, { middleware: middleware, upOrDown: 'up', depInfo: dependencyTree.upstream.dependents[i], upVarName: dependencyTree.upstream.dependents[i].upVarName, upVarPath: dependencyTree.upstream.dependents[i].upVarFile }));
                    dependencySet.add(dependencyTree.upstream.dependents[i].upVarName);
                }
            }
        }
        if (dependencyTree.downstream.dependents.length) {
            // downstream iterator: generates a component for each downstream dependency passing in the dependency name and path as props
            for (let i = 0; i < dependencyTree.downstream.dependents.length; i++) {
                if (dependencySet.has(dependencyTree.downstream.dependents[i].dependentFuncName)) {
                    dDependencies.push((0, jsx_runtime_1.jsx)(REDVItem_1.default, { middleware: middleware, upOrDown: 'down', depInfo: dependencyTree.downstream.dependents[i], depVarName: dependencyTree.downstream.dependents[i].dependentFuncName, depVarPath: dependencyTree.downstream.dependents[i].dependentFuncFile }));
                    dependencySet.add(dependencyTree.downstream.dependents[i].dependentFuncName);
                }
            }
        }
    }
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ style: caribox_1.default }, { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ className: 'redv-header' }, { children: "Dependencies" })), uDependencies, dDependencies] })));
}
exports.default = REDependencyViewer;
//# sourceMappingURL=REDependencyViewer.js.map