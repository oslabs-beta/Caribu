
interface REDVItemProps {
  upVarName?: string,
  upVarPath?: string,
  depVarName?: string,
  depVarPath?: string,
}

export default function REDVItem(props: REDVItemProps) {


  // only renders the respective variable in the div if the variable exists. otherwise it is blank.
  return (
      <div>
        <button className="redv-item" onClick={() => console.log('REDVItem clicked')}>
          {props.upVarName}
          {props.depVarName}
        </button>
      </div>

  )
}