import { useSelector } from "react-redux";
import { RootState } from "../../store";
import REDVItem from "./REDVItem";
import cariboxStyling from "../caribox";


export default function REDependencyViewer(props: object) {
  console.log("dependency viewer hook runnning")

  // get state for routes, currently selected middleware.
  const routes = useSelector((state: RootState) => state.views.routes);
  const middleware = useSelector((state: RootState) => state.views.curMiddleware);

  console.log(middleware)

  // assign depency tree to a variable for easier reference in code.
  const dependencyTree = middleware.deps;

  // creates a list for upstream and downstream dependencies.
  const uDependencies = [];
  const dDependencies = [];
  const dependencySet = new Set()
  // checks if upstream depencies exists
  if(dependencyTree){
    if (dependencyTree.upstream.dependents.length) {
      // usptream iterator: generates a component for each upstream dependency passing in the dependency name and path as props
      for(let i = 0; i < dependencyTree.upstream.dependents.length; i++){
        if (!dependencySet.has(dependencyTree.upstream.dependents[i].upVarName)) {
          uDependencies.push(<REDVItem middleware={middleware} upOrDown={'up'} depInfo={dependencyTree.upstream.dependents[i]} upVarName={dependencyTree.upstream.dependents[i].upVarName} upVarPath={dependencyTree.upstream.dependents[i].upVarFile} />);
          dependencySet.add(dependencyTree.upstream.dependents[i].upVarName)
        }
      }
    }
    if (dependencyTree.downstream.dependents.length) {
      // downstream iterator: generates a component for each downstream dependency passing in the dependency name and path as props
      for(let i = 0; i < dependencyTree.downstream.dependents.length; i++){
        if (dependencySet.has(dependencyTree.downstream.dependents[i].dependentFuncName)) {
          dDependencies.push(<REDVItem middleware={middleware} upOrDown='down' depInfo={dependencyTree.downstream.dependents[i]} depVarName={dependencyTree.downstream.dependents[i].dependentFuncName} depVarPath={dependencyTree.downstream.dependents[i].dependentFuncFile} />);
          dependencySet.add(dependencyTree.downstream.dependents[i].dependentFuncName)
        }
      }
    }
  }

  return (
      <div style={cariboxStyling}>
          <span className='redv-header'>Dependencies</span>
          {uDependencies}
          {dDependencies}
      </div>

  )
}