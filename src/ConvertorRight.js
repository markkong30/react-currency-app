import React from 'react';
import {checkStatus, json } from './utils'


class ConvertorRight extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      currencyList: [],
    }

  }

  componentDidMount() {
    fetch('https://altexchangerateapi.herokuapp.com/currencies')
      .then(checkStatus)
      .then(json)
      .then((data) => {
        const list = Object.getOwnPropertyNames(data);
        this.setState({ currencyList: list });
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      })
  }

  render () {
    const {currencyRightSelect} = this.props;
    const {currencyList} = this.state;

    return (

      <select className='text-center w-100' id="convertorRight" onChange={currencyRightSelect}>
      {currencyList.map((currency) => {
        return  <option key={currency} value={currency}>{currency}</option>
      })}
    </select>
     
    



    )
  }


}


export default ConvertorRight;

