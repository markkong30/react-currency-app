import React from 'react';
import {checkStatus, json } from './utils'


class ConvertorLeft extends React.Component {
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
    const { currencyLeftSelect} = this.props;
    const {currencyList} = this.state;

    return (

      <select className='text-center w-100' id="convertorLeft" onChange={currencyLeftSelect}>
      {currencyList.map((currency) => {
        return  <option key={currency} value={currency}>{currency}</option>
      })}
    </select>
     
    



    )
  }


}


export default ConvertorLeft;

