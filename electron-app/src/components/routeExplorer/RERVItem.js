"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viewsSlice_1 = require("../../slices/viewsSlice");
const react_redux_1 = require("react-redux");
function RERVItem(props) {
    const dispatch = (0, react_redux_1.useDispatch)();
    function selectRoute() {
        dispatch((0, viewsSlice_1.update_method)({ method: props.method, routeIndex: props.index }));
        dispatch((0, viewsSlice_1.update_dependency)({ middleware: {} }));
    }
    return (<div>
            <button className="rerv-item" onClick={selectRoute}>
                {props.method}: {props.name}
            </button>
        </div>);
}
exports.default = RERVItem;
