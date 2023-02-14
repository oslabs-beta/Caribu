import { useDispatch } from "react-redux"
import { RootState } from "../../store";
import { update_dependency } from "../../slices/viewsSlice";

interface REFVItemProps {
    middleware: object,
  }

export default function REFVItem(props: REFVItemProps) {

    const dispatch = useDispatch();

    function selectFunction(){
        console.log(funcName);
        dispatch(update_dependency({middleware: props.middleware}));
    }
    const funcName = props.middleware.functionInfo.funcName

    return (
        <div>
            <button className="refv-item" onClick={selectFunction}>
                {funcName}
            </button>
        </div>

    )
}