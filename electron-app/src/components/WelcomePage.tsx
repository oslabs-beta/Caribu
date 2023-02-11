import React from 'react';

const WelcomePage = (props: object) => {


  console.log(props);
  return (
    <div>
      <div className='wp-header'>Welcome. Yup</div>
      <div className='wp-instructions'>To get started, simply do stuff</div>
      <div className='form-wrapper'>
        <form>
          <input type="file"/>
          <input type="text"/>
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default WelcomePage;