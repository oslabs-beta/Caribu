import type { RootState } from '../../store';
import { useSelector } from 'react-redux';
import RERVItem from './RERVItem';

export default function RERouteViewer(props: object) {

  const routes = useSelector((state: RootState) => state.views.routes); // routes is an array of objects
  console.log('RERouteViewer routes state is ', routes);
  console.log('RERouteViewer routes.length is ', routes.length)
  const routeItems = [];
  for(let i = 0; i < routes.length; i++){
    const name: string = routes[i].routeName;
    console.log('RERouteViewer routes state name is ', name);
    const methods: string[] = Object.keys(routes[i].routeMethods);
    console.log('RERouteViewer routes state methods is ', methods);

    for(let j = 0; j < methods.length; j++)
      routeItems.push(
        <RERVItem method={methods[j]} name={name} index={i}/>
      );
  }
  
  console.log('RERouteViewer routeItems after loop is ', routeItems);

  return (
      <div>
        <span className='rerv-header'>Routes</span>
        {routeItems}
      </div>

  )
}