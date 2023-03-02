import POCMItem from './POCMItem';

interface POCDetailsProps {
  route: string,
  methods: (...args: any[]) => any,
}

export default function POCDetails(props: any) {
 
  const container = [];
  const methods = [];

  console.log('propsmethods', props.methods)

  // goes through each method in props.methods and each function associated to that method and generates a div element with the method and a div element for each function inside of it.
  for(const method in props.methods){
    const funcs = [];
    for(const func in props.methods[method]){
      console.log(props.methods[method][func])
      let isShared = false
      if (props.sharedObj[props.methods[method][func]] > 1) {isShared = true}
      console.log(isShared)
      // console.log("THIS IS MATCHING FUNC INFO", props.funcLibrary[props.methods[method][func]])
      const funcInfo = props.funcLibrary[props.methods[method][func]]
        funcs.push(
          <div style={{minWidth : '20vw'}}>
            <POCMItem middleware={func} funcInfo={funcInfo} isShared={isShared}></POCMItem>
          </div>
          
          // <div className="pocd-function">
          //   {props.methods[method][func]}
          // </div>
        )
    }
    methods.push(
      <div className="pocd-method-container">
        <div className="pocd-method">
          {method}
        </div>
        {/* <div className="pocd-functions"> */}
          {funcs}
        {/* </div> */}
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
      // <div className="poc-details">
      <div style={{
          backgroundImage: 'linear-gradient(#ABE0FF, rgba(171, 224, 255, 0.12))', 
          borderColor : '#F1EDE0',
          borderWidth : '2px',
          borderStyle : 'solid',
          borderRadius : '15px',
          padding: '5px',
          marginTop : '5px',
          paddingBottom : '10px'
      }}>
        {container}
      </div>

  )
}