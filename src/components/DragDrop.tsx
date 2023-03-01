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
      handleChange={handleChange}
      name="folder"
      label="Drag and drop your app folder here!"
    />
  );
}
