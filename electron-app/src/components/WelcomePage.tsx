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

const WelcomePage = (props: object) => {
  const dispatch = useDispatch();
  const views = useSelector((state: RootState) => state.views);
  return (
    <div className="welcomePage">
      <div className="wp-header">Welcome To Caribu</div>
      <div className="wp-instructions">
        To get started, drop your file into the dropzone, then simply specify
        your server files and node modules relative path, and submit!{" "}
      </div>
      <div>
        <DragDrop />
        <form className="form-wrapper">
          <input
            className="serverName-wrapper"
            type="text"
            placeholder="Enter server name here"
            onChange={async (e) => {
              await dispatch(update_serverpath({ path: e.target.value }));
            }}
          />
          <input
            className="nodePath-wrapper"
            type="text"
            placeholder="Enter node modules path here"
            onChange={async (e) => {
              await dispatch(update_nodepath({ path: e.target.value }));
            }}
          />
          <button
            className="serverSubmit"
            onClick={async (e) => {
              // check if server input is empty
              if (!views.serverpath) {
                alert("Please specify your servers name first!");
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
