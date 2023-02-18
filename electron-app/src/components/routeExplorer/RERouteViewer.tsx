import type { RootState } from '../../store';
import { useSelector } from 'react-redux';
import RERVItem from './RERVItem';

export default function RERouteViewer() {

  // grabs the route object from the redux state
  const routes = useSelector((state: RootState) => state.views.routes); // routes is an array of objects

  // for each route, assigns routename to name variable and then assigns method to the method variable for each method with then route. Passes name and method down as props along with the index i
  const routeItems = [];
  for(let i = 0; i < routes.length; i++){
    const name: string = routes[i].routeName;
    const methods: string[] = Object.keys(routes[i].routeMethods);
    for(let j = 0; j < methods.length; j++)
      routeItems.push(
        <RERVItem method={methods[j]} name={name} index={i} key={name + i}/>
      );
  }

  return (
      <div>
        <span className='rerv-header'>Routes</span>
        {routeItems}
      </div>

  )
}