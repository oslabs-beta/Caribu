export default function POCDetails(props: object) {
 
  const container = [];
  const methods = [];

  console.log('propsmethods', props.methods)

  for(const method in props.methods){
    const funcs = [];
    for(const func in props.methods[method]){
        funcs.push(
          <div className="pocd-function">
            {props.methods[method][func]}
          </div>
        )
    }
    methods.push(
      <div className="pocd-method-container">
        <div className="pocd-method">
          {method}
        </div>
        <div className="pocd-functions">
          {funcs}
        </div>
      </div>
    )
  }

  container.push(
    <div>
      <div className="pocd-route">
        {props.route}
      </div>
      <div className="pocd-methods">
        {methods}
      </div>
    </div>
  )

  return (
      <div className="poc-details">
        {container}
      </div>

  )
}