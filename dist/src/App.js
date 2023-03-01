"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const WelcomePage_1 = __importDefault(require("./components/WelcomePage"));
const RouteExplorer_1 = __importDefault(require("./views/RouteExplorer"));
const PurityOverview_1 = __importDefault(require("./views/PurityOverview"));
const Metrics_1 = __importDefault(require("./views/Metrics"));
function App() {
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, Object.assign({ to: "/" }, { children: "Welcome page" })) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, Object.assign({ to: "/rexplorer" }, { children: "Route Explorer" })) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, Object.assign({ to: "/purity" }, { children: "Purity Overview" })) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, Object.assign({ to: "/metrics" }, { children: "Metrics" })) }), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(WelcomePage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/rexplorer", element: (0, jsx_runtime_1.jsx)(RouteExplorer_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/purity", element: (0, jsx_runtime_1.jsx)(PurityOverview_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/metrics", element: (0, jsx_runtime_1.jsx)(Metrics_1.default, {}) })] })] }));
}
exports.default = App;
//# sourceMappingURL=App.js.map