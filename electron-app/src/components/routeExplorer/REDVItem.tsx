
interface REDVItemProps {
  upVarName?: string,
  upVarPath?: string,
  depVarName?: string,
  depVarPath?: string,
}

export default function REDVItem(props: REDVItemProps) {

  return (
      <div>
        <button className="redv-item" onClick={() => console.log('REDVItem clicked')}>
          {props.upVarName}
          {props.depVarName}
        </button>
      </div>

  )
}