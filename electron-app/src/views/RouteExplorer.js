"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const REDependencyViewer_1 = __importDefault(require("../components/routeExplorer/REDependencyViewer"));
const REFunctionViewer_1 = __importDefault(require("../components/routeExplorer/REFunctionViewer"));
const RERouteViewer_1 = __importDefault(require("../components/routeExplorer/RERouteViewer"));
const RouteExplorer = (props) => {
    console.log(props);
    return (<div className="re-main">
      <div className='re-routes'>
        <RERouteViewer_1.default />
      </div>
      <div className="re-functions">
        <REFunctionViewer_1.default />
      </div>
      <div className='re-dependencies'>
        <REDependencyViewer_1.default />
      </div>
    </div>);
};
exports.default = RouteExplorer;
