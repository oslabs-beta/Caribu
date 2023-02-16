"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const POContainer_1 = __importDefault(require("../components/purityOverview/POContainer"));
const Purity = (props) => {
    console.log(props);
    return (<div className="po-main">
      <div className="po-header">
        Route dependency Breakdowns
      </div>
      <div className="po-containers">
        <POContainer_1.default />
        <POContainer_1.default />
        <POContainer_1.default />
      </div>
    </div>);
};
// containers need to be generated on a for loop based on back end responses.
exports.default = Purity;
