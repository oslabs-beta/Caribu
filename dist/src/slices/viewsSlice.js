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
exports.update_nodepath = exports.update_serverpath = exports.update_filepath = exports.update_dependency = exports.update_method = exports.update_routes = exports.fetchRoutes = exports.viewsSlice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const testUrl = "http://localhost:3003/routes";
const initialState = {
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
exports.viewsSlice = (0, toolkit_1.createSlice)({
    name: "views",
    initialState,
    // RTK allows us to write "mutating" logic in reducers; it doesn't actually mutate the state because it uses a library that detects changes to a "draft state" which produces a new immutable state based off those changes
    reducers: {
        // update the routes in the state to render to the page
        update_routes: (state, action) => {
            console.log("viewsSlice update_routes fired with ", action.payload);
            state.routes = action.payload;
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
            console.log("viewsSliced update_nodepath fired with ", action.payload);
            const { path } = action.payload;
            state.nodepath = path;
        },
    },
});
// Thunk action creator for fetching /api/routes
const fetchRoutes = () => {
    console.log("viewsSlice fetchRoutes fired");
    // return the thunk "action" funtion
    return (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("viewsSlice anonymous thunk func fired");
        console.log("fetching to /api/routes with filepath: ", getState().views.filepath);
        console.log("fetching to /api/routes with serverpath: ", getState().views.serverpath);
        const response = yield fetch(testUrl, {
            method: "POST",
            // add a header: URLSearchParams sets the header for us so having below was causing an error
            /*       headers: {
                  Content-Type: 'application/x-www-form-urlencoded;charset=UTF-8'
                }, */
            body: new URLSearchParams({
                filepath: getState().views.filepath,
                serverpath: getState()
                    .views.filepath.concat("/")
                    .concat(getState().views.serverpath),
                nodepath: getState().views.nodepath,
            }),
        });
        console.log("viewsSlice server responded with :", response.body);
        dispatch((0, exports.update_routes)(yield response.json()));
        // const newJSON = require("../exampleResponse.json");
        // dispatch(update_routes(newJSON));
    });
};
exports.fetchRoutes = fetchRoutes;
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
_a = exports.viewsSlice.actions, exports.update_routes = _a.update_routes, exports.update_method = _a.update_method, exports.update_dependency = _a.update_dependency, exports.update_filepath = _a.update_filepath, exports.update_serverpath = _a.update_serverpath, exports.update_nodepath = _a.update_nodepath;
exports.default = exports.viewsSlice.reducer;
//# sourceMappingURL=viewsSlice.js.map