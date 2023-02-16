"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("react-dom/client");
const react_router_dom_1 = require("react-router-dom");
const App_1 = __importDefault(require("./App"));
const store_1 = require("./store");
const react_redux_1 = require("react-redux");
const domNode = document.getElementById("root");
const root = (0, client_1.createRoot)(domNode);
root.render(
// provide the redux store to react
<react_redux_1.Provider store={store_1.store}>
    <react_router_dom_1.HashRouter>
      <App_1.default />
    </react_router_dom_1.HashRouter>
  </react_redux_1.Provider>);
