import { ReactElement } from "react";
import POCDetails from "./POCDetails";
import cariboxStyling from "../caribox";

interface POContainerProps {
  funcLibrary : any,
  sharedRoutes: Set<string>,
  functions: Set<string>,
  reducedRoutes: object;
}

export default function POContainer(props: POContainerProps) {

  const routeContainer: ReactElement[] = [];

  //make a object that tracks which functions are shared

  console.log(props)
  const shared : string[] = []
  const sharedObj = {}
  
  props.reducedRoutes

  props.sharedRoutes.forEach(el => {
    let overlapArr = []
    console.log('rd',props.reducedRoutes[el]);
    for (let method in props.reducedRoutes[el]) {
      for (const funcName of props.reducedRoutes[el][method]) {
        console.log(funcName)
        console.log(sharedObj[funcName])
        sharedObj[funcName] ? sharedObj[funcName]++ : sharedObj[funcName] = 1
        // if (props.functions.has(funcName)) {
        //   shared.push(funcName)
        //   console.log("THIS IS A SHARED FUNC", funcName)
        // }
      }
    }
   
  }
  )
  console.log("sharedObj", sharedObj)


  // const {funcLibrary} = props
  // console.log("FUNC LIIB", funcLibrary)

  props.sharedRoutes.forEach(el => {
    let overlapArr = []
    console.log('rd',props.reducedRoutes[el]);
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
      <div>
        <POCDetails route={el} methods={props.reducedRoutes[el]} funcLibrary={props.funcLibrary} sharedObj={sharedObj}/>
      </div>
    )
  })

  return (
      <div style={cariboxStyling}>
        <div className="routes-container">
          {routeContainer}
        </div>
      </div>
  )
}