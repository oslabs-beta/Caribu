import type { RootState } from '../../store';
import { useSelector } from 'react-redux';

export default function RERouteViewer(props: object) {

  const routes = useSelector((state: RootState) => state.views.routes); // routes is an array of objects
  const items = [];
  for(let i = 0; i < routes.length; i++){
    const name = routes[i].routeName;
    const methods = Object.keys(routes[i].routeMethods);
    for(let j = 0; j < methods.length; j++)
      items.push(
      <div>
        <p>{methods[j]}: {name}</p>
      </div>
      );
  }

  return (
      <div>
          {items}
      </div>

  )
}