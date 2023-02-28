import type { RootState } from '../../store';
import { useSelector } from 'react-redux';
import RERVItem from './RERVItem';
import cariboxStyling from '../caribox'

export default function RERouteViewer() {

  // grabs the route object from the redux state
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
        <RERVItem method={methods[j]} name={name} index={i} key={name + i}/>
      );
  }
  
  console.log('RERouteViewer routeItems after loop is ', routeItems);
  return (
      <div style={cariboxStyling}>
        <span className='rerv-header'>Routes</span>
        <div style={{
          backgroundImage: 'linear-gradient(#ABE0FF, rgba(171, 224, 255, 0.12))', 
          borderColor : '#F1EDE0',
          borderWidth : '2px',
          borderStyle : 'solid',
          borderRadius : '15px',
          padding: '5px',
          marginTop : '5px',
          paddingBottom : '10px'
        }}>
         {routeItems}
        </div>

      </div>
  )
}