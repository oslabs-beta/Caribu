"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const viewsSlice_1 = require("../../slices/viewsSlice");
function REFVItem(props) {
    const dispatch = (0, react_redux_1.useDispatch)();
    function selectFunction() {
        console.log(funcName);
        dispatch((0, viewsSlice_1.update_dependency)({ middleware: props.middleware }));
    }
    const funcName = props.middleware.functionInfo.funcName;
    return (<div>
            <button className="refv-item" onClick={selectFunction}>
                {funcName}
            </button>
        </div>);
}
exports.default = REFVItem;
