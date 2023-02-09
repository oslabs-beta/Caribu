import REDependencyViewer from "./REDependencyViewer";
import REFunctionViewer from "./REFunctionViewer";
import RERouteViewer from "./RERouteViewer";


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
