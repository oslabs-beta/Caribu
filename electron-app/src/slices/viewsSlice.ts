import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";

// const { ipcRenderer } = require('electron')

const testUrl = "http://localhost:3003/routes";

export interface viewsState {
  // TODO: confirm with backend which properties are optional
  // TODO: update for all fetch methods
  routes: any
  // Array<{
  //   routeName: string;
  //   setOfMw: any;
  //   routeMethods: {
  //     GET?: {
  //       middlewares: Array<{
  //         functionInfo: {
  //           funcName: string;
  //           funcFile: string;
  //           funcPosition?: number[];
  //           funcDef?: string;
  //           funcAssignedTo?: string;
  //         };
  //         deps?: {
  //           totalUpstreamDeps?: number;
  //           totalDownstreamDeps?: number;
  //           upstream?: {
  //             upVarName: string;
  //             upVarFile: string;
  //             upVarPosition?: number[];
  //             upVarDef?: string;
  //             upVarUseInFunc?: string;
  //           };
  //           downstream?: {
  //             dependentFuncName: string;
  //             dependentFuncFile: string;
  //             dependentFuncPosition?: number[];
  //             dependentFuncDef?: string;
  //           };
  //         };
  //       }>;
  //     };
  //     POST?: {
  //       middlewares: Array<{
  //         functionInfo: {
  //           funcName: string;
  //           funcFile: string;
  //           funcPosition?: number[];
  //           funcDef?: string;
  //         };
  //         deps?: {
  //           totalUpstreamDeps?: number;
  //           totalDownstreamDeps?: number;
  //           upstream?: {
  //             upVarName: string;
  //             upVarFile: string;
  //             upVarPosition?: number[];
  //             upVarDef?: string;
  //             upVarUseInFunc?: string;
  //           };
  //           downstream?: {
  //             dependentFuncName: string;
  //             dependentFuncFile: string;
  //             dependentFuncPosition?: number[];
  //             dependentFuncDef?: string;
  //           };
  //         };
  //       }>;
  //     };
  //     DELETE?: {
  //       middlewares: Array<{
  //         functionInfo: {
  //           funcName: string;
  //           funcFile: string;
  //           funcPosition?: number[];
  //           funcDef?: string;
  //         };
  //         deps?: {
  //           totalUpstreamDeps?: number;
  //           totalDownstreamDeps?: number;
  //           upstream?: {
  //             upVarName: string;
  //             upVarFile: string;
  //             upVarPosition?: number[];
  //             upVarDef?: string;
  //             upVarUseInFunc?: string;
  //           };
  //           downstream?: {
  //             dependentFuncName: string;
  //             dependentFuncFile: string;
  //             dependentFuncPosition?: number[];
  //             dependentFuncDef?: string;
  //           };
  //         };
  //       }>;
  //     };
  //   };
  // }>
  ;
  controllers: object[];
  apis: object[];
  curMethod: string;
  routeIndex: number;
  curMetric: string;
  curMiddleware: any
  // {
  //   functionInfo?: {
  //     funcName: string;
  //     funcFile: string;
  //     funcPosition?: number[];
  //     funcDef?: string;
  //   };
  //   deps?: {
  //     totalUpstreamDeps?: number;
  //     totalDownstreamDeps?: number;
  //     upstream?: {
  //       upVarName: string;
  //       upVarFile: string;
  //       upVarPosition?: number[];
  //       upVarDef?: string;
  //       upVarUseInFunc?: string;
  //     };
  //     downstream?: {
  //       dependentFuncName: string;
  //       dependentFuncFile: string;
  //       dependentFuncPosition?: number[];
  //       dependentFuncDef?: string;
  //     };
  //   };
  // }
  ;
  filepath: string;
  serverpath: string;
  nodepath: string;
  directoryProcessed: boolean;
  mwLibrary: object;
  loading: boolean;
  loadingMessage: string;
  filters: Array<tag>;
}

type tag = {
  id: string;
  text: string;
};

const initialState: viewsState = {
  // FOR TESTING ONLY: populate initial state to test if redux state is accessible from components
  routes: [],
  controllers: [],
  apis: [],
  curMethod: "",
  routeIndex: null,
  curMetric: "",
  curMiddleware: {},
  filepath: "",
  serverpath: "",
  nodepath: "",
  directoryProcessed: false,
  mwLibrary: {},
  loading: false,
  loadingMessage: "Initializing...",
  filters: [],
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
      //update directoryProcessed to true
      state.directoryProcessed = true;
      // console.log(getState.views.directoryProcessed ,'directoryProcessed now true')
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
      console.log("viewsSlice update_N=nodePath fired with ", action.payload);
      const { path } = action.payload;
      state.nodepath = path;
    },
    update_mwLibrary: (state, action: PayloadAction<{ mwLib: object }>) => {
      console.log("mwLib has been updated with ", action.payload);
      const mwLib = action.payload;
      state.mwLibrary = mwLib;
    },
    update_loading: (state, action: PayloadAction< boolean >) => {
      console.log("loading state is now ", action.payload);
      const loading = action.payload;
      state.loading = loading;
    },
    update_loadingMessage: (
      state,
      action: PayloadAction< string >
    ) => {
      console.log("loading state is now ", action.payload);
      const loadingMessage = action.payload;
      state.loadingMessage = loadingMessage;
    },
    update_filters: (state, action: PayloadAction<{ filters: Array<tag> }>) => {
      console.log(
        "viewsSlice update_N=updateFilters fired with ",
        action.payload
      );
      const { filters } = action.payload;
      state.filters = filters;
    },
  },
});

// Thunk action creator for fetching /api/routes
export const fetchRoutes = () => {
  console.log("viewsSlice fetchRoutes fired");
  // return the thunk "action" funtion
  return async (dispatch: any, getState: any) => {
    dispatch(update_loading(true))
    console.log('viewsSlice anonymous thunk func fired');
    console.log('fetching to /api/routes with filepath: ', getState().views.filepath);
    console.log('fetching to /api/routes with serverpath: ', getState().views.serverpath);
    const response = await fetch(testUrl, {
      method: 'POST',
      // add a header: URLSearchParams sets the header for us so having below was causing an error
      /*headers: {
        Content-Type: 'application/x-www-form-urlencoded;charset=UTF-8'
      }, */
      body: new URLSearchParams({
        filepath: getState().views.filepath,
        serverpath: getState().views.serverpath,
        nodepath: getState().views.nodepath,
      }),
    });
    console.log('viewsSlice server responded with :', response.body);

    const newJSON = await response.json();

    // const response = await ipcRenderer.invoke('fetch-request', {
    //   url: '/test',
    //   method: 'POST',
    //   body: {
    //     filepath: getState().views.filepath,
    //     serverpath: getState().views.filepath.concat('/').concat(getState().views.serverpath),
    //   },
    // });
    // console.log('viewsSlice server responded with:', response);

    // ipcRenderer.send('send-request', {
    //   filepath: getState().views.filepath,
    //   serverpath: getState().views.filepath.concat('/').concat(getState().views.serverpath),
    // })

    // ipcRenderer.on('request-response', (event, data) => {
    //   console.log('viewsSlice server responded with:', data)
    // })

    // const newJSON = require("../exampleResponse.json");
    // const newJSON = require('../exampleResponseUs.json')
    // const newJSON = require('../dispatchResponse_dep.json')
    // const newJSON = require('../betterDeps.json')
    // const newJSON = require('../exampleAppDeps.json')

      dispatch(update_routes(newJSON));
      dispatch(update_loading(false));


    const funcLibrary: any = {};

    //This function parses through the routes object to isolate the middlewares down to an object with routename, method, and functionname.
    // function parseRoutes(){

    const routesDict: object = {};
    for (let i = 0; i < newJSON.length; i++) {
      const route: any = newJSON[i];
      for (const key in route.routeMethods) {
        const middlewares = route.routeMethods[key].middlewares;
        for (let j = 0; j < middlewares.length; j++) {
          const funcName = middlewares[j].functionInfo.funcName;
          if (!funcLibrary[funcName]) {
            funcLibrary[funcName] = {
              functionInfo: middlewares[j].functionInfo,
              deps: middlewares[j].deps,
            };
          }
        }
      }
    }
    dispatch(update_mwLibrary(funcLibrary));
  };
};
// };
//     console.log("viewsSlice anonymous thunk func fired");
//     console.log(
//       "fetching to /api/routes with filepath: ",
//       getState().views.filepath
//     );
//     console.log(
//       "fetching to /api/routes with serverpath: ",
//       getState().views.serverpath
//     );
//     const response = await fetch(testUrl, {
//       method: "POST",
//       // add a header: URLSearchParams sets the header for us so having below was causing an error
//       /*       headers: {
//         Content-Type: 'application/x-www-form-urlencoded;charset=UTF-8'
//       }, */
//       body: new URLSearchParams({
//         filepath: getState().views.filepath,
//         serverpath: getState().views.serverpath,
//         nodepath: getState().views.nodepath,
//       }),
//     });
//     console.log("viewsSlice server responded with :", response.body);
//     dispatch(update_routes(await response.json()));
//   };
// };

// Action creators are generated for each case reducer function
export const {
  update_routes,
  update_method,
  update_dependency,
  update_filepath,
  update_serverpath, 
  update_mwLibrary,
  update_loading,
  update_loadingMessage,
  update_nodepath,
  update_filters,
} = viewsSlice.actions;

export default viewsSlice.reducer;
