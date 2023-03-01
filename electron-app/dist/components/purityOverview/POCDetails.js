"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const POCMItem_1 = __importDefault(require("./POCMItem"));
function POCDetails(props) {
    const container = [];
    const methods = [];
    console.log('propsmethods', props.methods);
    // goes through each method in props.methods and each function associated to that method and generates a div element with the method and a div element for each function inside of it.
    for (const method in props.methods) {
        const funcs = [];
        for (const func in props.methods[method]) {
            console.log(props.methods[method][func]);
            let isShared = false;
            if (props.sharedObj[props.methods[method][func]] > 1) {
                isShared = true;
            }
            console.log(isShared);
            // console.log("THIS IS MATCHING FUNC INFO", props.funcLibrary[props.methods[method][func]])
            const funcInfo = props.funcLibrary[props.methods[method][func]];
            funcs.push((0, jsx_runtime_1.jsx)("div", Object.assign({ style: { minWidth: '20vw' } }, { children: (0, jsx_runtime_1.jsx)(POCMItem_1.default, { middleware: func, funcInfo: funcInfo, isShared: isShared }) }))
            // <div className="pocd-function">
            //   {props.methods[method][func]}
            // </div>
            );
        }
        methods.push((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "pocd-method-container" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "pocd-method" }, { children: method })), funcs] })));
    }
    // pushes the method div array into the container div array. and then renders the container div array.
    container.push((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "pocd-route" }, { children: props.route })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "pocd-methods" }, { children: methods }))] }));
    return (
    // <div className="poc-details">
    (0, jsx_runtime_1.jsx)("div", Object.assign({ style: {
            backgroundImage: 'linear-gradient(#ABE0FF, rgba(171, 224, 255, 0.12))',
            borderColor: '#F1EDE0',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderRadius: '15px',
            padding: '5px',
            marginTop: '5px',
            paddingBottom: '10px'
        } }, { children: container })));
}
exports.default = POCDetails;
//# sourceMappingURL=POCDetails.js.map