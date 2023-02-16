"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const POCDetails_1 = __importDefault(require("./POCDetails"));
function POContainer(props) {
    return (<div className="po-container">
          POContainer
          <POCDetails_1.default />
          <POCDetails_1.default />
          <POCDetails_1.default />
      </div>);
}
exports.default = POContainer;
