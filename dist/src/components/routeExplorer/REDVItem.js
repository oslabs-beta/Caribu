"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
function REDVItem(props) {
    // only renders the respective variable in the div if the variable exists. otherwise it is blank.
    return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("button", Object.assign({ className: "redv-item", onClick: () => console.log('REDVItem clicked') }, { children: [props.upVarName, props.depVarName] })) }));
}
exports.default = REDVItem;
//# sourceMappingURL=REDVItem.js.map