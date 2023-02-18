import { useSelector } from "react-redux";
import { RootState } from "../../store";
import REDVItem from "./REDVItem";


export default function REDependencyViewer(props: object) {

  // get state for routes, currently selected middleware.
  const routes = useSelector((state: RootState) => state.views.routes);
  const middleware = useSelector((state: RootState) => state.views.curMiddleware);

  // assign depency tree to a variable for easier reference in code.
  const dependencyTree = middleware.deps;

  // creates a list for upstream and downstream dependencies.
  const uDependencies = [];
  const dDependencies = [];
  
  // checks if upstream depencies exists
  if(dependencyTree){
    // usptream iterator: generates a component for each upstream dependency passing in the dependency name and path as props
    for(let i = 0; i < dependencyTree.upstream.length; i++){
      uDependencies.push(<REDVItem upVarName={dependencyTree.upstream[i].upVarName} upVarPath={dependencyTree.upstream[i].upVarFile} />);
    }

    // downstream iterator: generates a component for each downstream dependency passing in the dependency name and path as props
    for(let i = 0; i < dependencyTree.downstream.dependents.length; i++){
      dDependencies.push(<REDVItem depVarName={dependencyTree.downstream.dependents[i].dependentFuncName} depVarPath={dependencyTree.downstream.dependents[i].dependentFuncFile} />);
    }
  }

  return (
      <div>
          <span className='redv-header'>Dependencies</span>
          {uDependencies}
          {dDependencies}
      </div>

  )
}