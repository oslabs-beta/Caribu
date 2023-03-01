"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const POCDetails_1 = __importDefault(require("./POCDetails"));
function POContainer(props) {
    const routeContainer = [];
    props.sharedRoutes.forEach(el => {
        console.log('rd', props.reducedRoutes[el]);
        routeContainer.push((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(POCDetails_1.default, { route: el, methods: props.reducedRoutes[el] }) }));
    });
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "po-container" }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "routes-container" }, { children: routeContainer })) })));
}
exports.default = POContainer;
//# sourceMappingURL=POContainer.js.map