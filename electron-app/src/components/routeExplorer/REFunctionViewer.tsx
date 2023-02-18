import REFVItem from "./REFVItem";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

export default function REFunctionViewer(props: object) {

  // imports the routes object, current method selected, and the route index from the redux state.
  const routes = useSelector((state: RootState) => state.views.routes);
  const routeIndex = useSelector((state: RootState) => state.views.routeIndex);
  const method = useSelector((state: RootState) => state.views.curMethod);

  const functions = [];

  // if there is a method in the state, it sets the middlewares to the currently selected methods middleswares and passes the middlewares as props to a REFVITem component
  if(method){
    const middlewares = routes[routeIndex].routeMethods[method].middlewares;
    for(let i = 0; i < middlewares.length; i++){
      functions.push(<REFVItem middleware={middlewares[i]} />)
    }
  }

  return (
    <div>
      <span className='refv-header'>Functions</span>
      {functions}
    </div>

  )
}