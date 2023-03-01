"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_redux_1 = require("react-redux");
const Card_1 = __importDefault(require("@mui/material/Card"));
const Accordion_1 = __importDefault(require("@mui/material/Accordion"));
const AccordionSummary_1 = __importDefault(require("@mui/material/AccordionSummary"));
const AccordionDetails_1 = __importDefault(require("@mui/material/AccordionDetails"));
const funcBoxStyling_1 = __importDefault(require("../funcBoxStyling"));
function POCMItem(props) {
    const filePath = (0, react_redux_1.useSelector)((state) => state.views.filepath);
    const dispatch = (0, react_redux_1.useDispatch)();
    const conditionalFuncBoxStyling = Object.assign({}, funcBoxStyling_1.default);
    if (props.isShared)
        conditionalFuncBoxStyling.backgroundColor = '#FFED92';
    // updates the redux state with the currently selected dependency on click of the function component.
    // function selectFunction(){
    //     dispatch(update_dependency({middleware: props.middleware}));
    // }
    // console.log("POCMITEM funcINFO", props.funcInfo)
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
        console.log("filePath:", filePath);
        console.log("Fixed VSCode link:", userFilePath);
        return [userFilePath, relativeFilePath];
    };
    // //parse out a functions name data etc:
    // const parseData = (funcName : string) => {
    //     // let name = isolatePath(funcName)
    //     let returnObj = {
    //         name : isolateName(funcName),
    //         path : isolatePath(funcName),
    //         type : isolateType(funcName)
    //     }
    // }
    let { funcName, funcFile, funcDef, funcPosition, funcAssignedTo, funcLine } = props.funcInfo;
    const [userFilePath, relativeFilePath] = convertToUserFilePath(funcFile);
    const funcType = isolateType(funcName);
    // console.log("funcType", funcType)
    const vsCodeLink = `vscode://file${userFilePath}:${funcLine[0]}:${funcLine[1]}`;
    // console.log('VS CODE LINK: ', vsCodeLink)
    const [start, end] = funcPosition;
    // console.log(start, end)
    // console.log(funcDef)
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
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ style: { margin: '5px' } }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ style: conditionalFuncBoxStyling }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ style: { justifyContent: 'left', marginBottom: '5px' } }, { children: [(0, jsx_runtime_1.jsx)("h3", { children: funcAssignedTo || funcName }), linkAndSource] })), (0, jsx_runtime_1.jsxs)(Accordion_1.default, Object.assign({ style: { width: '100%' } }, { children: [(0, jsx_runtime_1.jsx)(AccordionSummary_1.default, { children: "See Code" }), (0, jsx_runtime_1.jsx)(AccordionDetails_1.default, { children: (0, jsx_runtime_1.jsx)(Card_1.default, Object.assign({ variant: "outlined", style: { backgroundColor: 'lightgrey', textAlign: 'left', whiteSpace: "pre-line", maxWidth: '100%', width: '100%', fontSize: '0.5em' } }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ style: { padding: '5px' } }, { children: funcDef })) })) })] }))] })) })));
}
exports.default = POCMItem;
//# sourceMappingURL=POCMItem.js.map