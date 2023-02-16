import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { fetchRoutes, update_filepath, update_serverpath } from "../slices/viewsSlice";

const WelcomePage = (props: object) => {
  const dispatch = useDispatch();
  const views = useSelector((state: RootState) => state.views);
  return (
    <div>
      <div className='wp-header'>Welcome. Yup</div>
      <div className='wp-instructions'>To get started, drag and drop your application folder. Then specify the relative path of your main server file. </div>
      <div className='form-wrapper'>
        <form>
          <input type="file" multiple onChange={async (e)=> {
            console.log('WelcomePage file onChange func fired with ', e.target.files[0].path);
            await dispatch(update_filepath({path: e.target.files[0].path}));
            console.log('WelcomePage file onChange after dispatch state is', views.filepath);
            }}/>
          <input type="text" onChange={async (e)=>{
            console.log('WelcomePage text onChange func fired with ', e.target.value);
            await dispatch(update_serverpath({path: e.target.value}));
            console.log('WelcomePage text onChange after dispatch state is', views.serverpath);
          }}/>
          <button onClick={async (e)=>{
            e.preventDefault();
            console.log("WelcomePage button onClick fired");
            await dispatch(fetchRoutes());
            console.log("WelcomePage button onClick after dispatch state is", views.routes);
            }}>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default WelcomePage;