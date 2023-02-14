export default function REDVItem(props: object) {

  return (
      <div>
        <button className="redv-item" onClick={() => console.log('REDVItem clicked')}>
          {props.upVarName}
          {props.depVarName}
        </button>
      </div>

  )
}