import REDependencyViewer from "../components/routeExplorer/REDependencyViewer";
import REFunctionViewer from "../components/routeExplorer/REFunctionViewer";
import RERouteViewer from "../components/routeExplorer/RERouteViewer";
/**for testing state*/
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
/**for testing state */

const RouteExplorer = (props: object) => {
  /**for testing state */
  const views = useSelector((state: RootState) => state.views);
  console.log('RouteExplorer routes state is ',views.routes);
  /**for testing state */

  console.log(props);
  return (
    <div className="re-main">
      <div className='re-routes'>
        <RERouteViewer/>
      </div>
      <div className="re-functions">
        <REFunctionViewer/>
      </div>
      <div className='re-dependencies'>
        <REDependencyViewer/>
      </div>
    </div>
  );
}

export default RouteExplorer;
