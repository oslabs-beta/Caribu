import { update_method, update_dependency} from "../../slices/viewsSlice";
import { useDispatch } from "react-redux";

interface RERVItemProps {
    method: string;
    name: string;
    index: number;
  }

export default function RERVItem(props: RERVItemProps) {
    const dispatch = useDispatch()

    function selectRoute(){
        dispatch(update_method({method: props.method, routeIndex: props.index}));
        dispatch(update_dependency({middleware: {}}));
    }

    return (
        <div>
            <button className="rerv-item" onClick={selectRoute}>
                {props.method}: {props.name}
            </button>
        </div>

    )
}