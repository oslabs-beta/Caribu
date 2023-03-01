"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_redux_1 = require("react-redux");
const viewsSlice_1 = require("../../slices/viewsSlice");
function REFVItem(props) {
    const dispatch = (0, react_redux_1.useDispatch)();
    // updates the redux state with the currently selected dependency on click of the function component.
    function selectFunction() {
        dispatch((0, viewsSlice_1.update_dependency)({ middleware: props.middleware }));
    }
    // assigns function name to funcname variable to allow it to render in the refv item component.
    const funcName = props.middleware.functionInfo.funcName;
    return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "refv-item", onClick: selectFunction }, { children: funcName })) }));
}
exports.default = REFVItem;
//# sourceMappingURL=REFVItem.js.map