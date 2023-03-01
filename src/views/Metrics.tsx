import MButton from "../components/metrics/MButton";
import MGraph from "../components/metrics/MGraph";
import MSuggestions from "../components/metrics/MSuggestion";


const Metrics = (props: object) => {


  console.log(props);
  return (
    <div className="m-main">
      Metrics Component
      <div className="m-buttons-container" >
        <MButton/>
        <MButton/>
      </div>
      <div className="m-information">
        <MGraph/>
        <MSuggestions/>
      </div>
    </div>
  );
}

export default Metrics;