"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_redux_1 = require("react-redux");
const viewsSlice_1 = require("../../slices/viewsSlice");
const Card_1 = __importDefault(require("@mui/material/Card"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const Accordion_1 = __importDefault(require("@mui/material/Accordion"));
const AccordionSummary_1 = __importDefault(require("@mui/material/AccordionSummary"));
const AccordionDetails_1 = __importDefault(require("@mui/material/AccordionDetails"));
const funcBoxStyling_1 = __importDefault(require("../funcBoxStyling"));
let newFuncBoxStyling;
function REFVItem(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const dispatch = (0, react_redux_1.useDispatch)();
    // updates the redux state with the currently selected dependency on click of the function component.
    function selectFunction() {
        dispatch((0, viewsSlice_1.update_dependency)({ middleware: props.middleware }));
    }
    const curMiddleware = (0, react_redux_1.useSelector)((state) => state.views.curMiddleware);
    console.log(((_a = curMiddleware === null || curMiddleware === void 0 ? void 0 : curMiddleware.functionInfo) === null || _a === void 0 ? void 0 : _a.funcName) === ((_c = (_b = props === null || props === void 0 ? void 0 : props.middleware) === null || _b === void 0 ? void 0 : _b.functionInfo) === null || _c === void 0 ? void 0 : _c.funcName));
    if (((_d = curMiddleware === null || curMiddleware === void 0 ? void 0 : curMiddleware.functionInfo) === null || _d === void 0 ? void 0 : _d.funcName) === ((_f = (_e = props === null || props === void 0 ? void 0 : props.middleware) === null || _e === void 0 ? void 0 : _e.functionInfo) === null || _f === void 0 ? void 0 : _f.funcName)) {
        newFuncBoxStyling = Object.assign(Object.assign({}, funcBoxStyling_1.default), { borderStyle: 'dashed', borderColor: '#025959', borderWidth: '2px' });
    }
    else {
        newFuncBoxStyling = Object.assign({}, funcBoxStyling_1.default);
    }
    const filePath = (0, react_redux_1.useSelector)((state) => state.views.filepath);
    const mwLibrary = (0, react_redux_1.useSelector)((state) => state.views.mwLibrary);
    // console.log(props.middleware)
    console.log(props.middleware.functionInfo.funcName, props.middleware.deps.upstream.dependents);
    console.log(props.middleware.functionInfo.funcName, props.middleware.deps.downstream.dependents);
    // console.log(props.middleware.deps.downstream.dependents)
    // console.log(props.middleware)
    // assigns function name to funcname variable to allow it to render in the refv item component.
    // const funcName = props.middleware.functionInfo.funcName
    // const isolatePath = (str : string):string => {
    //     const startIndex : number = str.indexOf('CBUPATH')+7
    //     let slicedString : string = str.slice(startIndex)
    //     // console.log("orignal path from name", slicedString)
    //     let parsedPath : string = slicedString.replaceAll('$', '/').replaceAll('_','.').replaceAll('Ü','-')
    //     // console.log("cleaned path from name", parsedPath)
    //     return parsedPath
    // }
    const isolateType = (str) => {
        const typeStart = str.indexOf('CBUTYPE_') + 8;
        const firstUnder = str.indexOf('_', typeStart + 12);
        let funcType = str.slice(typeStart, firstUnder);
        return funcType;
    };
    const isolateName = (str) => {
        // const nameStart : number = str.indexOf('CBUTYPE_')+8
        const firstUnder = str.indexOf('_', 8);
        let funcName = str.slice(0, firstUnder);
        return funcName;
    };
    const convertToUserFilePath = (str) => {
        const copiedServerIndex = str.indexOf('copiedServer');
        const relativeFilePath = funcFile.slice(copiedServerIndex + 12);
        let userFilePath = filePath + relativeFilePath;
        // const relativeFilePath = funcFile.replace(serverPath, '')
        console.log("Fixed VSCode link:", userFilePath);
        return [userFilePath, relativeFilePath];
    };
    let { funcName, funcFile, funcDef, funcPosition, funcAssignedTo, funcLine } = props.middleware.functionInfo;
    console.log("funcinfo from mwLibrary:", (_g = mwLibrary[funcName]) === null || _g === void 0 ? void 0 : _g.deps);
    console.log("functionInfo:", props.middleware.functionInfo);
    const [userFilePath, relativeFilePath] = convertToUserFilePath(funcFile);
    console.log("this is input serverpath:", filePath);
    const funcType = isolateType(funcName);
    // console.log("funcType", funcType)
    const vsCodeLink = `vscode://file${userFilePath}:${funcLine[0]}:${funcLine[1]}`;
    // console.log('VS CODE LINK: ', vsCodeLink)
    const [start, end] = funcPosition;
    // console.log(start, end)
    // console.log(funcDef)
    let button = [];
    if (((_k = (_j = (_h = mwLibrary[funcName]) === null || _h === void 0 ? void 0 : _h.deps) === null || _j === void 0 ? void 0 : _j.upstream) === null || _k === void 0 ? void 0 : _k.dependents.length) || ((_o = (_m = (_l = mwLibrary[funcName]) === null || _l === void 0 ? void 0 : _l.deps) === null || _m === void 0 ? void 0 : _m.downstream) === null || _o === void 0 ? void 0 : _o.dependents.length)) {
        button.push((0, jsx_runtime_1.jsx)(Button_1.default, Object.assign({ onClick: selectFunction, variant: "outlined", style: { width: '100%' } }, { children: "View Dependencies" })));
    }
    let newFuncName;
    console.log("funcName", funcName);
    if (funcType !== 'FUNCTIONDECLARATION') {
        if (funcName.includes('CBUNAME_IMPORTEDMIDDLEWARE')) {
            let secondUnder = funcName.indexOf('_', 10);
            let mwNumber = funcName.slice(secondUnder + 1);
            funcName = `Third Party Middleware #${mwNumber}`;
        }
        else {
            if (funcType === 'ARROWFUNCTION') {
                newFuncName = "Arrow Function";
            }
            else if (funcType === "FUNCTIONEXPRESSION") {
                newFuncName = "Function Expression";
            }
            else {
                newFuncName = isolateName(funcName);
            }
            funcName = `Anonymous ${newFuncName} at line ${funcLine[0]} in ${relativeFilePath}`;
        }
    }
    let linkAndSource = [];
    if (funcFile.length) {
        linkAndSource.push((0, jsx_runtime_1.jsx)("p", Object.assign({ style: { fontSize: '0.7em' } }, { children: (0, jsx_runtime_1.jsxs)("i", { children: ["Source File:", "\n", funcFile] }) })));
        linkAndSource.push((0, jsx_runtime_1.jsx)("a", Object.assign({ href: vsCodeLink, style: { textDecoration: 'none' } }, { children: "Open in VSCode" })));
    }
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ style: { margin: '5px' } }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ style: newFuncBoxStyling, onClick: selectFunction }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ style: { justifyContent: 'left', marginBottom: '5px' } }, { children: [(0, jsx_runtime_1.jsx)("h3", { children: funcAssignedTo || funcName }), linkAndSource] })), (0, jsx_runtime_1.jsxs)(Accordion_1.default, Object.assign({ style: { width: '100%' } }, { children: [(0, jsx_runtime_1.jsx)(AccordionSummary_1.default, { children: "See Code" }), (0, jsx_runtime_1.jsx)(AccordionDetails_1.default, { children: (0, jsx_runtime_1.jsx)(Card_1.default, Object.assign({ variant: "outlined", style: { backgroundColor: 'lightgrey', textAlign: 'left', whiteSpace: "pre-line", maxWidth: '100%', width: '100%', fontSize: '0.5em' } }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ style: { padding: '5px' } }, { children: funcDef })) })) })] })), (0, jsx_runtime_1.jsx)("br", {}), button] })) })));
}
exports.default = REFVItem;
//# sourceMappingURL=REFVItem.js.map