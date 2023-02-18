"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const WelcomePage = (props) => {
    console.log(props);
    return (<div>
      <div className='wp-header'>Welcome. Yup</div>
      <div className='wp-instructions'>To get started, simply do stuff</div>
      <div className='form-wrapper'>
        <form>
          <input type="file"/>
          <input type="text"/>
          <button>Submit</button>
        </form>
      </div>
    </div>);
};
exports.default = WelcomePage;
