import "../../src/index.css";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  fetchRoutes,
  update_filepath,
  update_serverpath,
  update_nodepath,
} from "../slices/viewsSlice";
import DragDrop from "./DragDrop";
import { CopyBlock } from "react-code-blocks";




const logo = require("./../../assets/text_logo.svg");
// import logo from "../../assets/text_logo.svg";

const WelcomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const views = useSelector((state: RootState) => state.views);
  return (
    <div className="welcomePage" style={{ marginTop: "8%", color: "#F1EDE0" }}>
      <img src={logo} alt="Logo" style={{width : '50%', maxHeight : '30vh', marginBottom : '-10%'}}/>
      <div style={{ marginTop: "10%" }} className="wp-header">
        Welcome To Caribu
      </div>
      <br></br>

      <div className="wp-instructions" style={{display : 'flex', flexDirection : 'column', alignItems : 'center', justifyContent : 'center'}}>
        To operate completely locally, the Caribu desktop app requires a local instance of our server to be running.
        <br></br>
        <div style={{backgroundColor : 'white',
          padding : '10px',
          marginTop : '2vh',
          borderRadius : '10px', 
          maxWidth : '80%', 
          display : 'flex', 
          alignItems : 'center', 
          justifyContent : 'center'}}>
          <div style={{textAlign : 'left'}}>
          <CopyBlock
            text={'git clone https://github.com/oslabs-beta/Caribu \ncd Caribu/server/ \nnpm i \nnode server'}
            language={'javascript'}
            showLineNumbers={false}
            startingLineNumber={0}
            theme={'atomOneLight'}
            wrapLines
          />
          </div>
        </div>
      </div>

      <div className="wp-instructions">
        To get started, drop the server folder for your application into the
        dropzone. <br></br>
        Then simply specify the absolute paths to your server file and node
        modules folder, and submit!{" "}
      </div>
      <div>
        <DragDrop />
        <form className="form-wrapper">
          <input
            className="serverName-wrapper"
            type="text"
            placeholder="Enter server path here"
            onChange={async (e) => {
              await dispatch(update_serverpath({ path: e.target.value }));
            }}
          />
          <input
            className="nodePath-wrapper"
            type="text"
            placeholder="Enter node module's path here"
            onChange={async (e) => {
              await dispatch(update_nodepath({ path: e.target.value }));
            }}
          />
          <button
            className="serverSubmit"
            onClick={async (e) => {
              // check if server input is empty
              if (!views.serverpath) {
                alert("Please specify your server's name first!");
                return;
              }
              e.preventDefault();
              await dispatch(fetchRoutes());
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomePage;
