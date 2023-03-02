"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.update_filters = exports.update_nodepath = exports.update_loadingMessage = exports.update_loading = exports.update_mwLibrary = exports.update_serverpath = exports.update_filepath = exports.update_dependency = exports.update_method = exports.update_routes = exports.fetchRoutes = exports.viewsSlice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
// const { ipcRenderer } = require('electron')
const testUrl = "http://localhost:3003/routes";
const initialState = {
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
exports.viewsSlice = (0, toolkit_1.createSlice)({
    name: "views",
    initialState,
    // RTK allows us to write "mutating" logic in reducers; it doesn't actually mutate the state because it uses a library that detects changes to a "draft state" which produces a new immutable state based off those changes
    reducers: {
        // update the routes in the state to render to the page
        update_routes: (state, action) => {
            console.log("viewsSlice update_routes fired with ", action.payload);
            state.routes = action.payload;
            //update directoryProcessed to true
            state.directoryProcessed = true;
            // console.log(getState.views.directoryProcessed ,'directoryProcessed now true')
        },
        update_method: (state, action) => {
            const { method, routeIndex } = action.payload;
            state.curMethod = method;
            state.routeIndex = routeIndex;
        },
        update_dependency: (state, action) => {
            const { middleware } = action.payload;
            state.curMiddleware = middleware;
        },
        update_filepath: (state, action) => {
            console.log("viewsSlice update_filepath fired with ", action.payload);
            const { path } = action.payload;
            state.filepath = path;
        },
        update_serverpath: (state, action) => {
            console.log("viewsSlice update_serverpath fired with ", action.payload);
            const { path } = action.payload;
            state.serverpath = path;
        },
        update_nodepath: (state, action) => {
            console.log("viewsSlice update_N=nodePath fired with ", action.payload);
            const { path } = action.payload;
            state.nodepath = path;
        },
        update_mwLibrary: (state, action) => {
            console.log("mwLib has been updated with ", action.payload);
            const mwLib = action.payload;
            state.mwLibrary = mwLib;
        },
        update_loading: (state, action) => {
            console.log("loading state is now ", action.payload);
            const loading = action.payload;
            state.loading = loading;
        },
        update_loadingMessage: (state, action) => {
            console.log("loading state is now ", action.payload);
            const loadingMessage = action.payload;
            state.loadingMessage = loadingMessage;
        },
        update_filters: (state, action) => {
            console.log("viewsSlice update_N=updateFilters fired with ", action.payload);
            const { filters } = action.payload;
            state.filters = filters;
        },
    },
});
// Thunk action creator for fetching /api/routes
const fetchRoutes = () => {
    console.log("viewsSlice fetchRoutes fired");
    // return the thunk "action" funtion
    return (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
        dispatch((0, exports.update_loading)(true));
        console.log('viewsSlice anonymous thunk func fired');
        console.log('fetching to /api/routes with filepath: ', getState().views.filepath);
        console.log('fetching to /api/routes with serverpath: ', getState().views.serverpath);
        const response = yield fetch(testUrl, {
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
        const newJSON = yield response.json();
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
        dispatch((0, exports.update_routes)(newJSON));
        dispatch((0, exports.update_loading)(false));
        const funcLibrary = {};
        //This function parses through the routes object to isolate the middlewares down to an object with routename, method, and functionname.
        // function parseRoutes(){
        const routesDict = {};
        for (let i = 0; i < newJSON.length; i++) {
            const route = newJSON[i];
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
        dispatch((0, exports.update_mwLibrary)(funcLibrary));
    });
};
exports.fetchRoutes = fetchRoutes;
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
_a = exports.viewsSlice.actions, exports.update_routes = _a.update_routes, exports.update_method = _a.update_method, exports.update_dependency = _a.update_dependency, exports.update_filepath = _a.update_filepath, exports.update_serverpath = _a.update_serverpath, exports.update_mwLibrary = _a.update_mwLibrary, exports.update_loading = _a.update_loading, exports.update_loadingMessage = _a.update_loadingMessage, exports.update_nodepath = _a.update_nodepath, exports.update_filters = _a.update_filters;
exports.default = exports.viewsSlice.reducer;
//# sourceMappingURL=viewsSlice.js.map