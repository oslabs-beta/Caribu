"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const REDVItem_1 = __importDefault(require("./REDVItem"));
function REDependencyViewer(props) {
    const routes = (0, react_redux_1.useSelector)((state) => state.views.routes);
    const middleware = (0, react_redux_1.useSelector)((state) => state.views.curMiddleware);
    const dependencyTree = middleware.deps;
    const uDependencies = [];
    const dDependencies = [];
    if (dependencyTree) {
        // usptream iterator
        for (let i = 0; i < dependencyTree.upstream.length; i++) {
            console.log(dependencyTree.upstream[i].upVarName, dependencyTree.upstream[i].upVarFile);
            uDependencies.push(<REDVItem_1.default upVarName={dependencyTree.upstream[i].upVarName} upVarPath={dependencyTree.upstream[i].upVarFile}/>);
        }
        // downstream iterator
        for (let i = 0; i < dependencyTree.downstream.dependents.length; i++) {
            console.log(dependencyTree.downstream.dependents[i].dependentFuncName, dependencyTree.downstream.dependents[i].dependentFuncFile);
            dDependencies.push(<REDVItem_1.default depVarName={dependencyTree.downstream.dependents[i].dependentFuncName} depVarPath={dependencyTree.downstream.dependents[i].dependentFuncFile}/>);
        }
    }
    return (<div>
          <span className='redv-header'>Dependencies</span>
          {uDependencies}
          {dDependencies}
      </div>);
}
exports.default = REDependencyViewer;
