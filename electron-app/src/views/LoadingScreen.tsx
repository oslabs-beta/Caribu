import { useDispatch, useSelector } from "react-redux";
import {Navigate, useLocation} from "react-router-dom"
import { RootState } from "../store";
import { update_loadingMessage } from "../slices/viewsSlice";
const logoCircleSpin = require("../assets/circle_logo_thicker.svg");

const LoadingScreen = (props: object) => {
  const dispatch = useDispatch();
  const views = useSelector((state: RootState) => state.views);

  const loadingMessage = useSelector((state: RootState) => state.views.loadingMessage);
  console.log("THIS IS LOADING LES")

  setTimeout(() => {
    dispatch(update_loadingMessage('Analyzing Control Flow Depencencies'))
  }, 3500)

  setTimeout(() => {
    dispatch(update_loadingMessage('Generating Results...'))
  }, 10000)

  console.log(props);
  if(!views.directoryProcessed) {
    return (
        <div className="loading-page">
          <img className="loading-logo" src={logoCircleSpin} alt="LogoCircleSpin" />
          <div>{loadingMessage}</div>
        </div>
    );
  }
  if(views.directoryProcessed) {
    return <Navigate to="/rexplorer"/>
  }
//   return (
//     <div class="loading-page">
//       <img class="loading-logo" src={logoCircleSpin} alt="LogoCircleSpin" />
//       <div>{loadingMessage}</div>
//     </div>
// );
  
}

export default LoadingScreen