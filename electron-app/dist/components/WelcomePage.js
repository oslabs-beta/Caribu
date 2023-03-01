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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("../../src/index.css");
const react_redux_1 = require("react-redux");
const viewsSlice_1 = require("../slices/viewsSlice");
const DragDrop_1 = __importDefault(require("./DragDrop"));
const text_logo_svg_1 = __importDefault(require("./../../assets/text_logo.svg"));
const WelcomePage = (props) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const views = (0, react_redux_1.useSelector)((state) => state.views);
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "welcomePage", style: { marginTop: '8%', color: '#F1EDE0' } }, { children: [(0, jsx_runtime_1.jsx)("img", { src: text_logo_svg_1.default, alt: "Logo" }), (0, jsx_runtime_1.jsx)("div", Object.assign({ style: { marginTop: '10%' }, className: "wp-header" }, { children: "Welcome To Caribu" })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "wp-instructions" }, { children: ["To get started, drop the server folder for your application into the dropzone. ", (0, jsx_runtime_1.jsx)("br", {}), "Then simply specify the absolute paths to your server file and node modules folder, and submit!", " "] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(DragDrop_1.default, {}), (0, jsx_runtime_1.jsxs)("form", Object.assign({ className: "form-wrapper" }, { children: [(0, jsx_runtime_1.jsx)("input", { className: "serverName-wrapper", type: "text", placeholder: "Enter server path here", onChange: (e) => __awaiter(void 0, void 0, void 0, function* () {
                                    yield dispatch((0, viewsSlice_1.update_serverpath)({ path: e.target.value }));
                                }) }), (0, jsx_runtime_1.jsx)("input", { className: "nodePath-wrapper", type: "text", placeholder: "Enter node module's path here", onChange: (e) => __awaiter(void 0, void 0, void 0, function* () {
                                    yield dispatch((0, viewsSlice_1.update_nodepath)({ path: e.target.value }));
                                }) }), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "serverSubmit", onClick: (e) => __awaiter(void 0, void 0, void 0, function* () {
                                    // check if server input is empty
                                    if (!views.serverpath) {
                                        alert("Please specify your server's name first!");
                                        return;
                                    }
                                    e.preventDefault();
                                    yield dispatch((0, viewsSlice_1.fetchRoutes)());
                                }) }, { children: "Submit" }))] }))] })] })));
};
exports.default = WelcomePage;
//# sourceMappingURL=WelcomePage.js.map