"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MButton_1 = __importDefault(require("../components/metrics/MButton"));
const MGraph_1 = __importDefault(require("../components/metrics/MGraph"));
const MSuggestion_1 = __importDefault(require("../components/metrics/MSuggestion"));
const Metrics = (props) => {
    console.log(props);
    return (<div className="m-main">
      Metrics Component
      <div className="m-buttons-container">
        <MButton_1.default />
        <MButton_1.default />
      </div>
      <div className="m-information">
        <MGraph_1.default />
        <MSuggestion_1.default />
      </div>
    </div>);
};
exports.default = Metrics;
