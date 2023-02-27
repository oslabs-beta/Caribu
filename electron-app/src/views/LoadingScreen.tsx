import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { update_loadingMessage } from "../slices/viewsSlice";

const LoadingScreen = (props: object) => {
  const dispatch = useDispatch();

  const loadingMessage = useSelector((state: RootState) => state.views.loadingMessage);
  console.log("THIS IS LOADING LES")

  // setTimeout(() => {
  //   dispatch(update_loadingMessage('Analyzing Control Flow Depencencies'))
  // }, 1000)

  // setTimeout(() => {
  //   dispatch(update_loadingMessage('Generating Results...'))
  // }, 6000)

  console.log(props);
  return (
      <h1>
        {loadingMessage}
      </h1>
  );
}

export default LoadingScreen