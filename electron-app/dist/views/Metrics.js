"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const MButton_1 = __importDefault(require("../components/metrics/MButton"));
const MGraph_1 = __importDefault(require("../components/metrics/MGraph"));
const MSuggestion_1 = __importDefault(require("../components/metrics/MSuggestion"));
const Metrics = (props) => {
    console.log(props);
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "m-main" }, { children: ["Metrics Component", (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "m-buttons-container" }, { children: [(0, jsx_runtime_1.jsx)(MButton_1.default, {}), (0, jsx_runtime_1.jsx)(MButton_1.default, {})] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "m-information" }, { children: [(0, jsx_runtime_1.jsx)(MGraph_1.default, {}), (0, jsx_runtime_1.jsx)(MSuggestion_1.default, {})] }))] })));
};
exports.default = Metrics;
//# sourceMappingURL=Metrics.js.map