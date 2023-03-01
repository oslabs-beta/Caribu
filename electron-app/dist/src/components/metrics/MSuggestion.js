"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const MSItem_1 = __importDefault(require("./MSItem"));
function MSuggestions(props) {
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "m-suggestions" }, { children: ["MSuggestions", (0, jsx_runtime_1.jsx)(MSItem_1.default, {}), (0, jsx_runtime_1.jsx)(MSItem_1.default, {}), (0, jsx_runtime_1.jsx)(MSItem_1.default, {})] })));
}
exports.default = MSuggestions;
//# sourceMappingURL=MSuggestion.js.map