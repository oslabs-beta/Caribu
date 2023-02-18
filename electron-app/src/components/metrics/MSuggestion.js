"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MSItem_1 = __importDefault(require("./MSItem"));
function MSuggestions(props) {
    return (<div className="m-suggestions">
          MSuggestions
          <MSItem_1.default />
          <MSItem_1.default />
          <MSItem_1.default />
      </div>);
}
exports.default = MSuggestions;
