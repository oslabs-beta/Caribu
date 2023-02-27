import { useDispatch } from "react-redux"
import { RootState } from "../../store";
import { update_dependency } from "../../slices/viewsSlice";
import { startTransition } from "react";

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import funcBoxStyling from "../funcBoxStyling";


interface REFVItemProps {
    middleware: object,
  }

export default function REFVItem(props: REFVItemProps) {

    const dispatch = useDispatch();

    // updates the redux state with the currently selected dependency on click of the function component.
    function selectFunction(){
        dispatch(update_dependency({middleware: props.middleware}));
    }

    // console.log(props.middleware)
    console.log(props.middleware.functionInfo.funcName, props.middleware.deps.upstream.dependents)
    console.log(props.middleware.functionInfo.funcName, props.middleware.deps.downstream.dependents)
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

    const isolateType = (str : string):string => {
        const typeStart : number = str.indexOf('CBUTYPE_')+8
        const firstUnder : number = str.indexOf('_', typeStart + 12)
        let funcType : string = str.slice(typeStart, firstUnder)
        return funcType
    }

    const isolateName = (str : string):string => {
        // const nameStart : number = str.indexOf('CBUTYPE_')+8
        const firstUnder : number = str.indexOf('_', 8)
        let funcName : string = str.slice(0, firstUnder)
        return funcName
    }

    let { funcName, funcFile, funcDef, funcPosition, funcAssignedTo } = props.middleware.functionInfo
    const funcType = isolateType(funcName)
    // console.log("funcType", funcType)
    const vsCodeLink = `vscode://file${funcFile}`
    // console.log('VS CODE LINK: ', vsCodeLink)
    const [start, end] = funcPosition
    // console.log(start, end)
    // console.log(funcDef)

    if (funcType !== 'FUNCTIONDECLARATION') {
        let newFuncName
        if (funcType === 'ARROWFUNCTION') {
            newFuncName = "Arrow Function"
        } else if (funcType === "FUNCTIONEXPRESSION") {
            newFuncName = "Function Expression"
        } else {
            newFuncName = isolateName(funcName)
        }
        funcName = `Anonymous ${newFuncName} at position ${start}`
    } 
    

    return (
        <div style={{margin : '5px'}}>
            {/* <Button variant="contained" className="refv-item" onClick={selectFunction}> */}
            <div style={funcBoxStyling} onClick={selectFunction}>
            {/* <Button variant="outlined" style={{textAlign : 'left', alignItems : "center", padding : '15px', display: 'flex', flexDirection : 'column', justifyContent:'center', maxWidth: '100%', wordBreak: 'break-word', backgroundColor : '#E0F0F5'}} onClick={selectFunction}> */}
                {/* <Card> */}
                        <div style={{justifyContent : 'left', marginBottom : '5px'}}>
                            <h3>{funcAssignedTo || funcName}</h3>
                            <p style={{fontSize : '0.7em'}}><i>Source File:{"\n"}{funcFile}</i></p>
                            <a href={vsCodeLink} style={{textDecoration : 'none'}}>Open in VSCode</a>
                        </div>
                <Accordion style={{width : '100%'}}>
                    <AccordionSummary>See Code</AccordionSummary>
                    <AccordionDetails>
                        <Card variant="outlined" style={{backgroundColor:'lightgrey', textAlign : 'left', whiteSpace: "pre-line", maxWidth: '100%', width : '100%', fontSize : '0.5em'}}>
                            <div style={{padding : '5px'}}>
                            {funcDef}    
                            </div>
                        </Card>
                    </AccordionDetails>
                </Accordion>
                <br/>
                <Button onClick={selectFunction} variant="outlined" style={{width : '100%'}} >View Dependencies</Button>
                {/* <div style={{backgroundColor:'lightgrey', whiteSpace: "pre-line"}}><p>{funcDef}</p></div> */}
                {/* </Card> */}
            </div>
            {/* </Button> */}
        </div>

    )
}       