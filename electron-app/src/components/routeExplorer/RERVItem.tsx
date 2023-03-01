import { update_method, update_dependency} from "../../slices/viewsSlice";
import { useDispatch } from "react-redux";
import Button from '@mui/material/Button';

interface RERVItemProps {
    method: string;
    name: string;
    index: number;
    highlight : boolean
  }

export default function RERVItem(props: RERVItemProps) {
    const dispatch = useDispatch()

    // this function updates the state with the current selected method and clears current middlewares on click of the route item components
    function selectRoute(){
        dispatch(update_method({method: props.method, routeIndex: props.index}));
        dispatch(update_dependency({middleware: {}}));
    }
    
    let buttonStyle = {
        color : '#255858'
    }
    if (props.highlight) {
        buttonStyle.backgroundColor = "#F2EDDF"
    }

    return (
        <div>
            <Button style={buttonStyle} onClick={selectRoute}>
                {props.method}: {props.name}
            </Button>
            {/* <button className="rerv-item" onClick={selectRoute}>
                {props.method}: {props.name}
            </button> */}
        </div>

    )
}