import { useSelector } from "react-redux";
import { RootState } from "../../store";
import REDVItem from "./REDVItem";


export default function REDependencyViewer(props: object) {

  const routes = useSelector((state: RootState) => state.views.routes);
  const middleware = useSelector((state: RootState) => state.views.curMiddleware);
  const dependencyTree = middleware.deps;

  const uDependencies = [];
  const dDependencies = [];
  
  if(dependencyTree){
    // usptream iterator
    for(let i = 0; i < dependencyTree.upstream.length; i++){
      console.log(dependencyTree.upstream[i].upVarName, dependencyTree.upstream[i].upVarFile)
      uDependencies.push(<REDVItem upVarName={dependencyTree.upstream[i].upVarName} upVarPath={dependencyTree.upstream[i].upVarFile} />);
    }

    // downstream iterator
    for(let i = 0; i < dependencyTree.downstream.dependents.length; i++){
      console.log(dependencyTree.downstream.dependents[i].dependentFuncName, dependencyTree.downstream.dependents[i].dependentFuncFile)
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