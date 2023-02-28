import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { update_loadingMessage } from "../slices/viewsSlice";
import logoCircleSpin from "../assets/circle_logo_thicker.svg"

const LoadingScreen = (props: object) => {
  const dispatch = useDispatch();

  const loadingMessage = useSelector((state: RootState) => state.views.loadingMessage);
  console.log("THIS IS LOADING LES")

  setTimeout(() => {
    dispatch(update_loadingMessage('Analyzing Control Flow Depencencies'))
  }, 3500)

  setTimeout(() => {
    dispatch(update_loadingMessage('Generating Results...'))
  }, 10000)

  console.log(props);
  return (
      <div class="loading-page">
        <img class="loading-logo" src={logoCircleSpin} alt="LogoCircleSpin" />
        <div>{loadingMessage}</div>
      </div>
  );
}

export default LoadingScreen