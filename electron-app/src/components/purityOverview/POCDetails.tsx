export default function POCDetails(props: object) {

  const container = [];
  const funcs = [];

  for(const obj in props.methods){
    for(const method in props.methods[obj]){
        funcs.push(
          <div>
            {props.methods[obj][method]}
          </div>
        )
    }
  }

  container.push(
    <div>
      <div>
        {props.route}
      </div>
      <div>
        {funcs}
      </div>
    </div>
  )

  return (
      <div className="poc-details">
        {container}
      </div>

  )
}