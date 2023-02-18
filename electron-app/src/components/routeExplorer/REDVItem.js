"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function REDVItem(props) {
    return (<div>
        <button className="redv-item" onClick={() => console.log('REDVItem clicked')}>
          {props.upVarName}
          {props.depVarName}
        </button>
      </div>);
}
exports.default = REDVItem;
