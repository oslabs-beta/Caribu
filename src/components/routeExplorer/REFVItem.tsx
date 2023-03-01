import { useDispatch } from "react-redux"
import { RootState } from "../../store";
import { update_dependency } from "../../slices/viewsSlice";

interface REFVItemProps {
    middleware: object,
  }

export default function REFVItem(props: REFVItemProps) {

    const dispatch = useDispatch();

    // updates the redux state with the currently selected dependency on click of the function component.
    function selectFunction(){
        dispatch(update_dependency({middleware: props.middleware}));
    }

    // assigns function name to funcname variable to allow it to render in the refv item component.
    const funcName = props.middleware.functionInfo.funcName

    return (
        <div>
            <button className="refv-item" onClick={selectFunction}>
                {funcName}
            </button>
        </div>

    )
}