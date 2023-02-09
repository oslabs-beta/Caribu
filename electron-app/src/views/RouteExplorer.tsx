import REDependencyViewer from "../components/routeExplorer/REDependencyViewer";
import REFunctionViewer from "../components/routeExplorer/REFunctionViewer";
import RERouteViewer from "../components/routeExplorer/RERouteViewer";


const RouteExplorer = (props: object) => {


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
