import "../../src/index.css";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  fetchRoutes,
  update_filepath,
  update_serverpath,
  update_nodepath,
} from "../slices/viewsSlice";
import DragDrop from "./DragDrop";

import logo from "./../../assets/text_logo.svg";

const WelcomePage = (props: object) => {
  const dispatch = useDispatch();
  const views = useSelector((state: RootState) => state.views);
  return (
    <div className="welcomePage" style={{ marginTop: "8%", color: "#F1EDE0" }}>
      <img src={logo} alt="Logo" />
      <div style={{ marginTop: "10%" }} className="wp-header">
        Welcome To Caribu
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
