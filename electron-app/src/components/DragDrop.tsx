import "../../src/index.css";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  fetchRoutes,
  update_filepath,
  update_serverpath,
} from "../slices/viewsSlice";
import { FileUploader } from "react-drag-drop-files";

export default function DragDrop() {
  const dispatch = useDispatch();
  const handleChange = async (folder: object) => {
    console.log(folder);
    await dispatch(update_filepath({ path: folder.path }));
    // const reader = new FileReader();
    // reader.readAsText(folder.path);
  };
  return (
    <FileUploader
      children={
        <div style={{borderColor : '#F1EDE0', borderStyle : 'dashed', borderRadius : '10px', color : '#F1EDE0', minHeight : '5vh', display : 'flex', alignItems : 'center', justifyContent : 'center'}}>
          <div>
          Drop your server directory here!
          </div>
        </div>
      }
      handleChange={handleChange}
      name="folder"
      label="Drag and drop your app folder here!"
    />
  );
}
