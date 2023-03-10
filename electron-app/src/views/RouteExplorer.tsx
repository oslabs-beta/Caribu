import REDependencyViewer from "../components/routeExplorer/REDependencyViewer";
import REFunctionViewer from "../components/routeExplorer/REFunctionViewer";
import RERouteViewer from "../components/routeExplorer/RERouteViewer";
/**for testing state*/
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
/**for testing state */

import {Navigate, useLocation} from "react-router-dom"

import Grid from '@mui/material/Grid';


const RouteExplorer = (props: object) => {
  /**for testing state */
  const views = useSelector((state: RootState) => state.views);
  console.log('RouteExplorer routes state is ',views.routes);
  /**for testing state */

  if(!views.directoryProcessed) {
    console.log("USER NOT PROCESSED")
    return <Navigate to="/"/>
  }


  console.log(props);
  return (
    <div style={{display : 'flex', flexDirection : 'column' , alignItems : 'center', color : '#F1EDE0', marginTop : '5%'}}>

    <h1 >Route Explorer</h1>
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
      <Grid item xs={2} sm={4} md={4}>
        {/* <div className='re-routes'> */}
          <RERouteViewer/>
        {/* </div> */}
      </Grid>
      <Grid item xs={2} sm={4} md={4}>
        {/* <div className="re-functions"> */}
          <REFunctionViewer/>
        {/* </div> */}
      </Grid>
      <Grid item xs={2} sm={4} md={4}>
        {/* <div className='re-dependencies'> */}
          <REDependencyViewer/>
        {/* </div> */}
      </Grid>
      {/* </div> */}

    </Grid>
    </div>

    // <div className="re-main">
    //   <div className='re-routes'>
    //     <RERouteViewer/>
    //   </div>
    //   <div className="re-functions">
    //     <REFunctionViewer/>
    //   </div>
    //   <div className='re-dependencies'>
    //     <REDependencyViewer/>
    //   </div>
    // </div>
  );
}

export default RouteExplorer;
