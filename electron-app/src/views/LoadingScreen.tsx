import { useDispatch, useSelector } from "react-redux";
import {Navigate, useLocation} from "react-router-dom"
import { RootState } from "../store";
import { update_loadingMessage } from "../slices/viewsSlice";
import logoCircleSpin from "../assets/circle_logo_thicker.svg"

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
<<<<<<< HEAD
  return (
      <div class="loading-page">
        <h2 style={{color : '#F1EDE0'}}>{loadingMessage}</h2>
        <img class="loading-logo" src={logoCircleSpin} alt="LogoCircleSpin" />
      </div>
  );
=======
  if(!views.directoryProcessed) {
    return (
        <div class="loading-page">
          <img class="loading-logo" src={logoCircleSpin} alt="LogoCircleSpin" />
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
  
>>>>>>> dev
}

export default LoadingScreen