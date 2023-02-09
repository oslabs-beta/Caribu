import POContainer from "../components/purityOverview/POContainer";

const Purity = (props: object) => {


  console.log(props);
  return (
    <div className="po-main">
      <div className="po-header">
        Route dependency Breakdowns
      </div>
      <div className="po-containers">
        <POContainer/>
        <POContainer/>
        <POContainer/>
      </div>
    </div>
  );
}

// containers need to be generated on a for loop based on back end responses.

export default Purity;