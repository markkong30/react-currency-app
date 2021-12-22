import React from 'react';
import { checkStatus, json } from './utils'

class ConvertorLeft extends React.Component {
  constructor(props) {
    super(props);
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

  render() {
    const { currencyLeftSelect, amountInputSubmit, amountInput, amountInputHandler } = this.props;
    const { currencyList } = this.state;

    return (
      <div className='col-10 col-md-4'>
        <form className="dropdown" onSubmit={amountInputSubmit}>
          <h4 className='text-center pb-4'>From</h4>

          <select className='text-center w-100' id="convertorLeft" onChange={currencyLeftSelect}>
            {currencyList.map((currency) => {
              return <option key={currency} value={currency}>{currency}</option>
            })}
          </select>

          <input className='my-4 text-center w-100' type='number' placeholder='1.00' step='0.0001' min='0' max='9999999'
            value={amountInput}
            onChange={amountInputHandler}

          />
        </form>
      </div>
    )
  }
}

export default ConvertorLeft;

