"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const client_1 = require("react-dom/client");
const react_router_dom_1 = require("react-router-dom");
const App_1 = __importDefault(require("./App"));
const store_1 = require("./store");
const react_redux_1 = require("react-redux");
const domNode = document.getElementById("root");
const root = (0, client_1.createRoot)(domNode);
root.render(
// provide the redux store to react
(0, jsx_runtime_1.jsx)(react_redux_1.Provider, Object.assign({ store: store_1.store }, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.HashRouter, { children: (0, jsx_runtime_1.jsx)(App_1.default, {}) }) })));
//# sourceMappingURL=Main.js.map