interface POCDetailsProps {
  route: string,
  methods: (...args: any[]) => any,
}

export default function POCDetails(props: POCDetailsProps) {
 
  const container = [];
  const methods = [];

  console.log('propsmethods', props.methods)

  // goes through each method in props.methods and each function associated to that method and generates a div element with the method and a div element for each function inside of it.
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

// pushes the method div array into the container div array. and then renders the container div array.
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