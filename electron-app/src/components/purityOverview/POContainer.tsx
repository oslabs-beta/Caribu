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
    console.log('rd',props.reducedRoutes[el]);

    routeContainer.push(
      <div>
        <POCDetails route={el} methods={props.reducedRoutes[el]}/>
      </div>
    )
  })

  return (
      <div className="po-container">
        <div className="routes-container">
          {routeContainer}
        </div>
      </div>

  )
}