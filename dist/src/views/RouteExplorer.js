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
const RouteExplorer = (props) => {
    /**for testing state */
    const views = (0, react_redux_1.useSelector)((state) => state.views);
    console.log('RouteExplorer routes state is ', views.routes);
    /**for testing state */
    console.log(props);
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "re-main" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: 're-routes' }, { children: (0, jsx_runtime_1.jsx)(RERouteViewer_1.default, {}) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "re-functions" }, { children: (0, jsx_runtime_1.jsx)(REFunctionViewer_1.default, {}) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: 're-dependencies' }, { children: (0, jsx_runtime_1.jsx)(REDependencyViewer_1.default, {}) }))] })));
};
exports.default = RouteExplorer;
//# sourceMappingURL=RouteExplorer.js.map