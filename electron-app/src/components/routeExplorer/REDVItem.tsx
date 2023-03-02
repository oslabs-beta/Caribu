import { original } from "@reduxjs/toolkit"
import funcBoxStyling from "../funcBoxStyling"
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { RootState } from "../../store";
import { useSelector } from "react-redux";

interface REDVItemProps {
  middleware: object,
  depInfo: object,
  upOrDown: string,
  upVarName?: string,
  upVarPath?: string,
  depVarName?: string,
  depVarPath?: string,
}

export default function REDVItem(props: any) {
  const mwLibrary: any = useSelector((state: RootState) => state.views.mwLibrary);
  const filePath = useSelector((state: RootState) => state.views.filepath);
  console.log('filePAth:', filePath)
  console.log(mwLibrary)
  const {middleware} = props
  console.log(middleware)
  

  const convertToUserFilePath = (str : string):string[] => {
    const copiedServerIndex = str.indexOf('copiedServer')
    const relativeFilePath = str.slice(copiedServerIndex + 12)
    const userFilePath = filePath + relativeFilePath
    // const relativeFilePath = funcFile.replace(serverPath, '')
    // console.log("Fixed VSCode link:", userFilePath)
    return [userFilePath, relativeFilePath]
}

  console.log(props.depInfo)
  if (props.upOrDown === 'up') {
    const { upVarName, upVarFile, originalDeclaration } = props.depInfo
    const { definition, position, funcName, line } = originalDeclaration
    console.log("original def name: ", funcName)
    // console.log(middleware.functionInfo.funcDef)
    // console.log(middleware.functionInfo.funcDef.replace(upVarName, `<mark>${upVarName}</mark>`))
    console.log("mwLib[funcName]", mwLibrary[funcName])
    console.log("originalDeclaration.position", position)
    const [userFilePath, relativeFilePath] = convertToUserFilePath(upVarFile)
    let linkEl = null
    if (line) {
      const vsCodeLink = `vscode://file${userFilePath}:${line[0]}:${line[1]}`
      console.log("newVSCodeLink", vsCodeLink)
      linkEl = <a href={vsCodeLink} style={{textDecoration : 'none'}}>Open in VSCode</a>
    }

    return (

      <div style={{margin : '5px'}}>
        <div style={funcBoxStyling}>
              <div style={{justifyContent : 'left', marginBottom : '5px'}}>
                  <h3>{upVarName}</h3>
                  <p style={{fontSize : '0.7em'}}><i>Originally Declared In:{"\n"}{upVarFile}</i></p>
                  {linkEl}
              </div>
            <Accordion style={{width : '100%'}}>
                <AccordionSummary>Original Definition</AccordionSummary>
                <AccordionDetails>
                    <Card variant="outlined" style={{backgroundColor:'lightgrey', textAlign : 'left', whiteSpace: "pre-line", maxWidth: '100%', width : '100%', fontSize : '0.5em'}}>
                        <div style={{padding : '5px'}}>
                          {definition}
                        {/* {mwLibrary[funcName]}     */}
                        </div>
                    </Card>
                </AccordionDetails>
            </Accordion>
            <Accordion style={{width : '100%'}}>
                <AccordionSummary>Use in Function</AccordionSummary>
                <AccordionDetails>
                    <Card variant="outlined" style={{backgroundColor:'lightgrey', textAlign : 'left', whiteSpace: "pre-line", maxWidth: '100%', width : '100%', fontSize : '0.5em'}}>
                        <div style={{padding : '5px'}} dangerouslySetInnerHTML={{__html: middleware.functionInfo.funcDef.replaceAll(new RegExp(upVarName, 'g'), '<mark>$&</mark>')}}>
                        {/* {middleware.functionInfo.funcDef.replaceAll(upVarName, `<mark>${upVarName}</mark>`)}     */}
                        </div>
                    </Card>
                </AccordionDetails>
            </Accordion>
        </div>
        {/* </Button> */}
      </div>
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



    )

  }

  if (props.upOrDown === 'down') {
    const { dependentFuncName, dependentFuncFile, dependentFuncPosition, dependentFuncDef } = props.depInfo

    return (
      <div style={funcBoxStyling}>
          Interacts With:
          {props.upVarName}
          {props.depVarName}
        <button className="redv-item" onClick={() => console.log('REDVItem clicked')}>
        </button>
      </div>

    )
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