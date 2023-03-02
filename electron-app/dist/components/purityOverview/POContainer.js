"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const POCDetails_1 = __importDefault(require("./POCDetails"));
const caribox_1 = __importDefault(require("../caribox"));
const newCariboxStyling = Object.assign(Object.assign({}, caribox_1.default), { minHeight: '5vh' });
function POContainer(props) {
    const routeContainer = [];
    //make a object that tracks which functions are shared
    console.log(props);
    const shared = [];
    const sharedObj = {};
    props.reducedRoutes;
    props.sharedRoutes.forEach((el) => {
        // let overlapArr: any = []
        console.log('rd', props.reducedRoutes[el]);
        for (const method in props.reducedRoutes[el]) {
            for (const funcName of props.reducedRoutes[el][method]) {
                console.log(funcName);
                console.log(sharedObj[funcName]);
                sharedObj[funcName] ? sharedObj[funcName]++ : sharedObj[funcName] = 1;
                // if (props.functions.has(funcName)) {
                //   shared.push(funcName)
                //   console.log("THIS IS A SHARED FUNC", funcName)
                // }
            }
        }
    });
    console.log("sharedObj", sharedObj);
    // const {funcLibrary} = props
    // console.log("FUNC LIIB", funcLibrary)
    props.sharedRoutes.forEach((el) => {
        // const overlapArr = []
        console.log('rd', props.reducedRoutes[el]);
        // for (let method in props.reducedRoutes[el]) {
        //   for (const funcName of props.reducedRoutes[el][method]) {
        //     sharedObj[funcName] ? shared[funcName]++ : sharedObj[funcName] = 1
        //     // if (props.functions.has(funcName)) {
        //     //   shared.push(funcName)
        //     //   console.log("THIS IS A SHARED FUNC", funcName)
        //     // }
        //   }
        // }
        // console.log("sharedObj", sharedObj)
        // if props.functions.has(props.reducedRoutes[el])
        routeContainer.push(
        // <Accordion style={{width : '100%'}}>
        // <AccordionSummary>See Code</AccordionSummary>
        // <AccordionDetails>
        (0, jsx_runtime_1.jsx)(POCDetails_1.default, { route: el, methods: props.reducedRoutes[el], funcLibrary: props.funcLibrary, sharedObj: sharedObj })
        // </AccordionDetails>
        // </Accordion>
        // <div>
        //   <POCDetails route={el} methods={props.reducedRoutes[el]} funcLibrary={props.funcLibrary} sharedObj={sharedObj}/>
        // </div>
        );
    });
    return (
    // <div style={newCariboxStyling}>
    (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "routes-container" }, { children: routeContainer }))
    // </div>
    );
}
exports.default = POContainer;
//# sourceMappingURL=POContainer.js.map