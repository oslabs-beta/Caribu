import { ReactElement } from "react";
import POCDetails from "./POCDetails";

interface POContainerProps {
  sharedRoutes: Set<string>,
  functions: Set<string>,
  reducedRoutes: object;
}

export default function POContainer(props: POContainerProps) {

  const routeContainer: ReactElement[] = [];

  props.sharedRoutes.forEach(el => {
    const methods = [];
    for(const method in props.reducedRoutes[el]){
      console.log('rd',props.reducedRoutes[el][method])
      methods.push(props.reducedRoutes[el][method]);
    }

    routeContainer.push(
      <div>
        <POCDetails route={el} methods={methods}/>
      </div>
    )
    console.log('method', methods)
  })

  return (
      <div className="po-container">
        <div className="routes-container">
          {routeContainer}
        </div>
      </div>

  )
}