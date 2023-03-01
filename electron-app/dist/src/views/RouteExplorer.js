"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const REDependencyViewer_1 = __importDefault(require("../components/routeExplorer/REDependencyViewer"));
const REFunctionViewer_1 = __importDefault(require("../components/routeExplorer/REFunctionViewer"));
const RERouteViewer_1 = __importDefault(require("../components/routeExplorer/RERouteViewer"));
/**for testing state*/
const react_redux_1 = require("react-redux");
/**for testing state */
const react_router_dom_1 = require("react-router-dom");
const Grid_1 = __importDefault(require("@mui/material/Grid"));
const RouteExplorer = (props) => {
    /**for testing state */
    const views = (0, react_redux_1.useSelector)((state) => state.views);
    console.log('RouteExplorer routes state is ', views.routes);
    /**for testing state */
    if (!views.directoryProcessed) {
        console.log("USER NOT PROCESSED");
        return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/" });
    }
    console.log(props);
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ style: { display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#F1EDE0', marginTop: '5%' } }, { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Route Explorer" }), (0, jsx_runtime_1.jsxs)(Grid_1.default, Object.assign({ container: true, spacing: { xs: 2, md: 3 }, columns: { xs: 4, sm: 8, md: 12 } }, { children: [(0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, xs: 2, sm: 4, md: 4 }, { children: (0, jsx_runtime_1.jsx)(RERouteViewer_1.default, {}) })), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, xs: 2, sm: 4, md: 4 }, { children: (0, jsx_runtime_1.jsx)(REFunctionViewer_1.default, {}) })), (0, jsx_runtime_1.jsx)(Grid_1.default, Object.assign({ item: true, xs: 2, sm: 4, md: 4 }, { children: (0, jsx_runtime_1.jsx)(REDependencyViewer_1.default, {}) }))] }))] }))
    // <div className="re-main">
    //   <div className='re-routes'>
    //     <RERouteViewer/>
    //   </div>
    //   <div className="re-functions">
    //     <REFunctionViewer/>
    //   </div>
    //   <div className='re-dependencies'>
    //     <REDependencyViewer/>
    //   </div>
    // </div>
    );
};
exports.default = RouteExplorer;
//# sourceMappingURL=RouteExplorer.js.map