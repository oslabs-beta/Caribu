"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const viewsSlice_1 = require("../../slices/viewsSlice");
const react_redux_1 = require("react-redux");
function RERVItem(props) {
    const dispatch = (0, react_redux_1.useDispatch)();
    // this function updates the state with the current selected method and clears current middlewares on click of the route item components
    function selectRoute() {
        dispatch((0, viewsSlice_1.update_method)({ method: props.method, routeIndex: props.index }));
        dispatch((0, viewsSlice_1.update_dependency)({ middleware: {} }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("button", Object.assign({ className: "rerv-item", onClick: selectRoute }, { children: [props.method, ": ", props.name] })) }));
}
exports.default = RERVItem;
//# sourceMappingURL=RERVItem.js.map