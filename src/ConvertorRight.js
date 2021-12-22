import React from 'react';
import { checkStatus, json } from './utils'

class ConvertorRight extends React.Component {
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
    const { currencyRightSelect, sideSwap, amountAfterConvert } = this.props;
    const { currencyList } = this.state;

    return (
      <React.Fragment>
        <div className='col-10 col-md-4 d-flex justify-content-center align-self-center'>
          <button className='btn exchange my-5 my-md-0' onClick={sideSwap}>
            <i class="fas fa-exchange-alt"></i>
          </button>
        </div>

        <div className='col-10 col-md-4 text-center'>
          <form>
            <h4 className='text-center pb-4'>To</h4>
            <select className='text-center w-100' id="convertorRight" onChange={currencyRightSelect}>
              {currencyList.map((currency) => {
                return <option key={currency} value={currency}>{currency}</option>
              })}
            </select>

            <h5 className='my-4'>{amountAfterConvert}</h5>
          </form>
        </div>
      </React.Fragment>

    )
  }
}

export default ConvertorRight;

