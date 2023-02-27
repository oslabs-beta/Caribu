import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";

const testUrl = "http://localhost:3003/routes";

export interface viewsState {
  // TODO: confirm with backend which properties are optional
  // TODO: update for all fetch methods
  routes: Array<{
    routeName: string;
    routeMethods: {
      GET?: {
        middlewares: Array<{
          functionInfo: {
            funcName: string;
            funcFile: string;
            funcPosition?: number[];
            funcDef?: string;
          };
          deps?: {
            totalUpstreamDeps?: number;
            totalDownstreamDeps?: number;
            upstream?: {
              upVarName: string;
              upVarFile: string;
              upVarPosition?: number[];
              upVarDef?: string;
              upVarUseInFunc?: string;
            };
            downstream?: {
              dependentFuncName: string;
              dependentFuncFile: string;
              dependentFuncPosition?: number[];
              dependentFuncDef?: string;
            };
          };
        }>;
      };
      POST?: {
        middlewares: Array<{
          functionInfo: {
            funcName: string;
            funcFile: string;
            funcPosition?: number[];
            funcDef?: string;
          };
          deps?: {
            totalUpstreamDeps?: number;
            totalDownstreamDeps?: number;
            upstream?: {
              upVarName: string;
              upVarFile: string;
              upVarPosition?: number[];
              upVarDef?: string;
              upVarUseInFunc?: string;
            };
            downstream?: {
              dependentFuncName: string;
              dependentFuncFile: string;
              dependentFuncPosition?: number[];
              dependentFuncDef?: string;
            };
          };
        }>;
      };
      DELETE?: {
        middlewares: Array<{
          functionInfo: {
            funcName: string;
            funcFile: string;
            funcPosition?: number[];
            funcDef?: string;
          };
          deps?: {
            totalUpstreamDeps?: number;
            totalDownstreamDeps?: number;
            upstream?: {
              upVarName: string;
              upVarFile: string;
              upVarPosition?: number[];
              upVarDef?: string;
              upVarUseInFunc?: string;
            };
            downstream?: {
              dependentFuncName: string;
              dependentFuncFile: string;
              dependentFuncPosition?: number[];
              dependentFuncDef?: string;
            };
          };
        }>;
      };
    };
  }>;
  controllers: object[];
  apis: object[];
  curMethod: string;
  routeIndex: number;
  curMetric: string;
  curMiddleware: object;
  filepath: string;
  serverpath: string;
  nodepath: string;
}

const initialState: viewsState = {
  // FOR TESTING ONLY: populate initial state to test if redux state is accessible from components
  routes: [],
  controllers: [],
  apis: [],
  curMethod: "",
  routeIndex: 0,
  curMetric: "",
  curMiddleware: {},
  filepath: "",
  serverpath: "",
  nodepath: "",
};

export const viewsSlice = createSlice({
  name: "views",
  initialState,
  // RTK allows us to write "mutating" logic in reducers; it doesn't actually mutate the state because it uses a library that detects changes to a "draft state" which produces a new immutable state based off those changes
  reducers: {
    // update the routes in the state to render to the page
    update_routes: (state, action: PayloadAction<viewsState["routes"]>) => {
      console.log("viewsSlice update_routes fired with ", action.payload);
      state.routes = action.payload;
    },
    update_method: (
      state,
      action: PayloadAction<{ method: string; routeIndex: number }>
    ) => {
      const { method, routeIndex } = action.payload;
      state.curMethod = method;
      state.routeIndex = routeIndex;
    },
    update_dependency: (
      state,
      action: PayloadAction<{ middleware: object }>
    ) => {
      const { middleware } = action.payload;
      state.curMiddleware = middleware;
    },
    update_filepath: (state, action: PayloadAction<{ path: string }>) => {
      console.log("viewsSlice update_filepath fired with ", action.payload);
      const { path } = action.payload;
      state.filepath = path;
    },
    update_serverpath: (state, action: PayloadAction<{ path: string }>) => {
      console.log("viewsSlice update_serverpath fired with ", action.payload);
      const { path } = action.payload;
      state.serverpath = path;
    },
    update_nodepath: (state, action: PayloadAction<{ path: string }>) => {
      console.log("viewsSliced update_nodepath fired with ", action.payload);
      const { path } = action.payload;
      state.nodepath = path;
    },
  },
});

// Thunk action creator for fetching /api/routes
export const fetchRoutes = () => {
  console.log("viewsSlice fetchRoutes fired");
  // return the thunk "action" funtion
  return async (dispatch: AppDispatch, getState: RootState) => {
    // console.log('viewsSlice anonymous thunk func fired');
    // console.log('fetching to /api/routes with filepath: ', getState().views.filepath);
    // console.log('fetching to /api/routes with serverpath: ', getState().views.serverpath);
//     const response = await fetch(testUrl, {
//       method: 'POST',
//       // add a header: URLSearchParams sets the header for us so having below was causing an error
// /*       headers: {
//         Content-Type: 'application/x-www-form-urlencoded;charset=UTF-8'
//       }, */
//       body: new URLSearchParams({
//         filepath: getState().views.filepath,
//         serverpath: getState().views.filepath.concat('/').concat(getState().views.serverpath),
//       }),
//     });
//     console.log('viewsSlice server responded with :', response.body);

    
    
//     dispatch(update_routes(await response.json()));


    const newJSON = require('../exampleResponse.json')
    dispatch(update_routes(newJSON));
  }
}
    console.log("viewsSlice anonymous thunk func fired");
    console.log(
      "fetching to /api/routes with filepath: ",
      getState().views.filepath
    );
    console.log(
      "fetching to /api/routes with serverpath: ",
      getState().views.serverpath
    );
    const response = await fetch(testUrl, {
      method: "POST",
      // add a header: URLSearchParams sets the header for us so having below was causing an error
      /*       headers: {
        Content-Type: 'application/x-www-form-urlencoded;charset=UTF-8'
      }, */
      body: new URLSearchParams({
        filepath: getState().views.filepath,
        serverpath: getState().views.serverpath,
        nodepath: getState().views.nodepath,
      }),
    });
    console.log("viewsSlice server responded with :", response.body);
    dispatch(update_routes(await response.json()));
  };
};

// Action creators are generated for each case reducer function
export const {
  update_routes,
  update_method,
  update_dependency,
  update_filepath,
  update_serverpath,
  update_nodepath,
} = viewsSlice.actions;

export default viewsSlice.reducer;
