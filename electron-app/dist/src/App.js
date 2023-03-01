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
const AppBar_1 = __importDefault(require("@mui/material/AppBar"));
const Container_1 = __importDefault(require("@mui/material/Container"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const MenuItem_1 = __importDefault(require("@mui/material/MenuItem"));
const react_router_dom_2 = require("react-router-dom");
const Toolbar_1 = __importDefault(require("@mui/material/Toolbar"));
const react_redux_1 = require("react-redux");
const LoadingScreen_1 = __importDefault(require("./views/LoadingScreen"));
// import logospin from './assets/logocirclespin.gif'
function App() {
    const navigate = (0, react_router_dom_2.useNavigate)();
    const loading = (0, react_redux_1.useSelector)((state) => state.views.loading);
    const navToRE = () => {
        navigate("/rexplorer");
    };
    const navToPO = () => {
        navigate('/purity');
    };
    const navToHome = () => {
        navigate('/');
    };
    if (loading)
        return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(LoadingScreen_1.default, {}) }));
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(AppBar_1.default, Object.assign({ style: { backgroundColor: '#255858' } }, { children: (0, jsx_runtime_1.jsx)(Container_1.default, Object.assign({ maxWidth: "xl" }, { children: (0, jsx_runtime_1.jsxs)(Toolbar_1.default, Object.assign({ disableGutters: true }, { children: [(0, jsx_runtime_1.jsx)(MenuItem_1.default, Object.assign({ onClick: navToRE }, { children: (0, jsx_runtime_1.jsx)(Typography_1.default, Object.assign({ textAlign: "center" }, { children: "Route Explorer" })) })), (0, jsx_runtime_1.jsx)(MenuItem_1.default, Object.assign({ onClick: navToPO }, { children: (0, jsx_runtime_1.jsx)(Typography_1.default, Object.assign({ textAlign: "center" }, { children: "Purity Overview" })) })), (0, jsx_runtime_1.jsx)(MenuItem_1.default, Object.assign({ onClick: navToHome }, { children: (0, jsx_runtime_1.jsx)(Typography_1.default, Object.assign({ textAlign: "center" }, { children: "Home" })) }))] })) })) })), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: '/', element: (0, jsx_runtime_1.jsx)(WelcomePage_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: '/rexplorer', element: (0, jsx_runtime_1.jsx)(RouteExplorer_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: '/purity', element: (0, jsx_runtime_1.jsx)(PurityOverview_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: '/metrics', element: (0, jsx_runtime_1.jsx)(Metrics_1.default, {}) })] })] }));
}
exports.default = App;
//# sourceMappingURL=App.js.map