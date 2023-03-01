"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
function POCDetails(props) {
    const container = [];
    const methods = [];
    console.log('propsmethods', props.methods);
    // goes through each method in props.methods and each function associated to that method and generates a div element with the method and a div element for each function inside of it.
    for (const method in props.methods) {
        const funcs = [];
        for (const func in props.methods[method]) {
            funcs.push((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "pocd-function" }, { children: props.methods[method][func] })));
        }
        methods.push((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "pocd-method-container" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "pocd-method" }, { children: method })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "pocd-functions" }, { children: funcs }))] })));
    }
    // pushes the method div array into the container div array. and then renders the container div array.
    container.push((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "pocd-route" }, { children: props.route })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "pocd-methods" }, { children: methods }))] }));
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "poc-details" }, { children: container })));
}
exports.default = POCDetails;
//# sourceMappingURL=POCDetails.js.map