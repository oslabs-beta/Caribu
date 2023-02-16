import type { RootState } from '../../store';
import { useSelector } from 'react-redux';
import RERVItem from './RERVItem';

export default function RERouteViewer(props: object) {

  const routes = useSelector((state: RootState) => state.views.routes); // routes is an array of objects
  console.log('RERouteViewer routes state is ', routes);
  const routeItems = [];
  for(let i = 0; i < routes.length; i++){
    const name: string = routes[i].routeName;
    const methods: string[] = Object.keys(routes[i].routeMethods);
    for(let j = 0; j < methods.length; j++)
      routeItems.push(
        <RERVItem method={methods[j]} name={name} index={i}/>
      );
  }

  return (
      <div>
        <span className='rerv-header'>Routes</span>
        {routeItems}
      </div>

  )
}