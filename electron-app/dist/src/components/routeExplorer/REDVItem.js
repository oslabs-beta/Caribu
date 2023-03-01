"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const funcBoxStyling_1 = __importDefault(require("../funcBoxStyling"));
const Card_1 = __importDefault(require("@mui/material/Card"));
const Accordion_1 = __importDefault(require("@mui/material/Accordion"));
const AccordionSummary_1 = __importDefault(require("@mui/material/AccordionSummary"));
const AccordionDetails_1 = __importDefault(require("@mui/material/AccordionDetails"));
const react_redux_1 = require("react-redux");
function REDVItem(props) {
    const mwLibrary = (0, react_redux_1.useSelector)((state) => state.views.mwLibrary);
    const filePath = (0, react_redux_1.useSelector)((state) => state.views.filepath);
    console.log('filePAth:', filePath);
    console.log(mwLibrary);
    const { middleware } = props;
    console.log(middleware);
    const convertToUserFilePath = (str) => {
        const copiedServerIndex = str.indexOf('copiedServer');
        const relativeFilePath = str.slice(copiedServerIndex + 12);
        let userFilePath = filePath + relativeFilePath;
        // const relativeFilePath = funcFile.replace(serverPath, '')
        // console.log("Fixed VSCode link:", userFilePath)
        return [userFilePath, relativeFilePath];
    };
    console.log(props.depInfo);
    if (props.upOrDown === 'up') {
        const { upVarName, upVarFile, originalDeclaration } = props.depInfo;
        const { definition, position, funcName, line } = originalDeclaration;
        console.log("original def name: ", funcName);
        // console.log(middleware.functionInfo.funcDef)
        // console.log(middleware.functionInfo.funcDef.replace(upVarName, `<mark>${upVarName}</mark>`))
        console.log("mwLib[funcName]", mwLibrary[funcName]);
        console.log("originalDeclaration.position", position);
        const [userFilePath, relativeFilePath] = convertToUserFilePath(upVarFile);
        let linkEl = null;
        if (line) {
            const vsCodeLink = `vscode://file${userFilePath}:${line[0]}:${line[1]}`;
            console.log("newVSCodeLink", vsCodeLink);
            linkEl = (0, jsx_runtime_1.jsx)("a", Object.assign({ href: vsCodeLink, style: { textDecoration: 'none' } }, { children: "Open in VSCode" }));
        }
        return ((0, jsx_runtime_1.jsx)("div", Object.assign({ style: { margin: '5px' } }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ style: funcBoxStyling_1.default }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ style: { justifyContent: 'left', marginBottom: '5px' } }, { children: [(0, jsx_runtime_1.jsx)("h3", { children: upVarName }), (0, jsx_runtime_1.jsx)("p", Object.assign({ style: { fontSize: '0.7em' } }, { children: (0, jsx_runtime_1.jsxs)("i", { children: ["Originally Declared In:", "\n", upVarFile] }) })), linkEl] })), (0, jsx_runtime_1.jsxs)(Accordion_1.default, Object.assign({ style: { width: '100%' } }, { children: [(0, jsx_runtime_1.jsx)(AccordionSummary_1.default, { children: "Original Definition" }), (0, jsx_runtime_1.jsx)(AccordionDetails_1.default, { children: (0, jsx_runtime_1.jsx)(Card_1.default, Object.assign({ variant: "outlined", style: { backgroundColor: 'lightgrey', textAlign: 'left', whiteSpace: "pre-line", maxWidth: '100%', width: '100%', fontSize: '0.5em' } }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ style: { padding: '5px' } }, { children: definition })) })) })] })), (0, jsx_runtime_1.jsxs)(Accordion_1.default, Object.assign({ style: { width: '100%' } }, { children: [(0, jsx_runtime_1.jsx)(AccordionSummary_1.default, { children: "Use in Function" }), (0, jsx_runtime_1.jsx)(AccordionDetails_1.default, { children: (0, jsx_runtime_1.jsx)(Card_1.default, Object.assign({ variant: "outlined", style: { backgroundColor: 'lightgrey', textAlign: 'left', whiteSpace: "pre-line", maxWidth: '100%', width: '100%', fontSize: '0.5em' } }, { children: (0, jsx_runtime_1.jsx)("div", { style: { padding: '5px' }, dangerouslySetInnerHTML: { __html: middleware.functionInfo.funcDef.replaceAll(new RegExp(upVarName, 'g'), '<mark>$&</mark>') } }) })) })] }))] })) }))
        // <div style={funcBoxStyling}>
        //     {/* Depends On:
        //     {upVarName}<br/>
        //     {upVarFile}<br/>
        //     Originally declared in : {funcName}<br/>
        //     Definition: {definition}<br/>
        //   <button className="redv-item" onClick={() => console.log('REDVItem clicked')}>
        //     {props.upVarName}
        //   </button> */}
        // </div>
        );
    }
    if (props.upOrDown === 'down') {
        const { dependentFuncName, dependentFuncFile, dependentFuncPosition, dependentFuncDef } = props.depInfo;
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ style: funcBoxStyling_1.default }, { children: ["Interacts With:", props.upVarName, props.depVarName, (0, jsx_runtime_1.jsx)("button", { className: "redv-item", onClick: () => console.log('REDVItem clicked') })] })));
    }
    // // only renders the respective variable in the div if the variable exists. otherwise it is blank.
    // return (
    //     <div style={funcBoxStyling}>
    //       <button className="redv-item" onClick={() => console.log('REDVItem clicked')}>
    //         {props.upVarName}
    //         {props.depVarName}
    //       </button>
    //     </div>
    // )
}
exports.default = REDVItem;
//# sourceMappingURL=REDVItem.js.map