"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const WelcomePage_1 = __importDefault(require("./components/WelcomePage"));
const RouteExplorer_1 = __importDefault(require("./views/RouteExplorer"));
const PurityOverview_1 = __importDefault(require("./views/PurityOverview"));
const Metrics_1 = __importDefault(require("./views/Metrics"));
function App() {
    return (<div>
      <div>
        <react_router_dom_1.Link to="/">Welcome page</react_router_dom_1.Link>
      </div>
      <div>
        <react_router_dom_1.Link to="/rexplorer">Route Explorer</react_router_dom_1.Link>
      </div>
      <div>
        <react_router_dom_1.Link to="/purity">Purity Overview</react_router_dom_1.Link>
      </div>
      <div>
        <react_router_dom_1.Link to="/metrics">Metrics</react_router_dom_1.Link>
      </div>
      <react_router_dom_1.Routes>
        <react_router_dom_1.Route path='/' element={<WelcomePage_1.default />}/>
        <react_router_dom_1.Route path='/rexplorer' element={<RouteExplorer_1.default />}/>
        <react_router_dom_1.Route path='/purity' element={<PurityOverview_1.default />}/>
        <react_router_dom_1.Route path='/metrics' element={<Metrics_1.default />}/>
      </react_router_dom_1.Routes>
    </div>);
}
exports.default = App;
