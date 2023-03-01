"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
const viewsSlice_1 = require("../slices/viewsSlice");
const circle_logo_thicker_svg_1 = __importDefault(require("../assets/circle_logo_thicker.svg"));
const LoadingScreen = (props) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const views = (0, react_redux_1.useSelector)((state) => state.views);
    const loadingMessage = (0, react_redux_1.useSelector)((state) => state.views.loadingMessage);
    console.log("THIS IS LOADING LES");
    setTimeout(() => {
        dispatch((0, viewsSlice_1.update_loadingMessage)('Analyzing Control Flow Depencencies'));
    }, 3500);
    setTimeout(() => {
        dispatch((0, viewsSlice_1.update_loadingMessage)('Generating Results...'));
    }, 10000);
    console.log(props);
    if (!views.directoryProcessed) {
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ class: "loading-page" }, { children: [(0, jsx_runtime_1.jsx)("img", { class: "loading-logo", src: circle_logo_thicker_svg_1.default, alt: "LogoCircleSpin" }), (0, jsx_runtime_1.jsx)("div", { children: loadingMessage })] })));
    }
    if (views.directoryProcessed) {
        return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/rexplorer" });
    }
    //   return (
    //     <div class="loading-page">
    //       <img class="loading-logo" src={logoCircleSpin} alt="LogoCircleSpin" />
    //       <div>{loadingMessage}</div>
    //     </div>
    // );
};
exports.default = LoadingScreen;
//# sourceMappingURL=LoadingScreen.js.map