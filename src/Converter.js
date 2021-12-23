import React from 'react';
import { checkStatus, json } from './utils'
import './Converter.css'

class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currencyLeft: 'AUD',
      currencyRight: 'AUD',
      amountInput: 1,
      amountAfterConvert: 1,
    }
    this.currencyLeftSelect = this.currencyLeftSelect.bind(this);
    this.currencyRightSelect = this.currencyRightSelect.bind(this);
    this.amountInputHandler = this.amountInputHandler.bind(this);
    this.amountInputSubmit = this.amountInputSubmit.bind(this);
    this.sideSwap = this.sideSwap.bind(this);
  }

  currencyLeftSelect(event) {
    const currencyLeft = event.target.value;
    this.setState({ currencyLeft });

    const { currencyRight, amountInput } = this.state;
    if (currencyLeft == currencyRight) {
      return this.setState({ amountAfterConvert: amountInput })
    }

    fetch(`https://altexchangerateapi.herokuapp.com/latest?from=${currencyLeft}&to=${currencyRight}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        let convert = (amountInput * data.rates[currencyRight]).toFixed(4);
        this.setState({ amountAfterConvert: convert })
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      })
  }

  currencyRightSelect(event) {
    const currencyRight = event.target.value;
    this.setState({ currencyRight });

    const { currencyLeft, amountInput } = this.state;
    if (currencyLeft == currencyRight) {
      return this.setState({ amountAfterConvert: amountInput })
    }

    fetch(`https://altexchangerateapi.herokuapp.com/latest?from=${currencyLeft}&to=${currencyRight}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        let convert = (amountInput * data.rates[currencyRight]).toFixed(4);
        this.setState({ amountAfterConvert: convert })
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      })
  }

  amountInputHandler(event) {
    const amountInput = event.target.value;
    const check = amountInput.length - amountInput.indexOf('.') - 1;
    if (check > 4 && amountInput.indexOf('.') !== -1) {
      return;
    } else if (amountInput.length > 10) {
      return;
    }

    this.setState({ amountInput });
    const { currencyLeft, currencyRight } = this.state;
    if (currencyLeft == currencyRight) {
      if (amountInput == '') {
        return this.setState({ amountAfterConvert: 0 });
      }
      const fixedAmountInput = parseFloat(amountInput).toFixed(4);
      return this.setState({ amountAfterConvert: fixedAmountInput });
    }
    fetch(`https://altexchangerateapi.herokuapp.com/latest?from=${currencyLeft}&to=${currencyRight}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        let convert = (amountInput * data.rates[currencyRight]).toFixed(4);
        this.setState({ amountAfterConvert: convert })
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      })
  }

  amountInputSubmit(event) {
    event.preventDefault();
  }

  sideSwap() {
    const { currencyLeft, currencyRight, amountInput, amountAfterConvert } = this.state;
    this.setState({
      currencyLeft: currencyRight,
      currencyRight: currencyLeft,
      amountInput: parseFloat(amountAfterConvert).toFixed(4),
      amountAfterConvert: parseFloat(amountInput).toFixed(4),
    })
    const left = document.querySelector('#converterLeft');
    const right = document.querySelector('#converterRight');
    const leftSave = left.selectedIndex;
    left.selectedIndex = right.selectedIndex;
    right.selectedIndex = leftSave;

  }

  render() {
    const { currencyList } = this.props;
    const { currencyLeft, currencyRight, amountInput, amountAfterConvert } = this.state;
    const listMap = currencyList.map((currency) => {
      return <option key={currency} value={currency}>{currency}</option>
    });

    return (
      <React.Fragment>
        <div className='col-10 col-md-4'>
          <form className="dropdown" onSubmit={this.amountInputSubmit}>
            <h4 className='text-center pb-4'>From</h4>

            <select className='text-center w-100' id="converterLeft" onChange={this.currencyLeftSelect}>
              {listMap}
            </select>

            <input className='my-4 text-center w-100' type='number' placeholder='1.00' step='0.0001' min='0' max='9999999'
              value={amountInput}
              onChange={this.amountInputHandler}
            />
          </form>
        </div>

        <div className='col-10 col-md-4 d-flex justify-content-center align-self-center'>
          <button className='btn exchange my-5 my-md-0' onClick={this.sideSwap}>
            <i className="fas fa-exchange-alt"></i>
          </button>
        </div>

        <div className='col-10 col-md-4 text-center'>
          <form>
            <h4 className='text-center pb-4'>To</h4>
            <select className='text-center w-100' id="converterRight" onChange={this.currencyRightSelect}>
              {listMap}
            </select>

            <h5 className='my-4'>{amountAfterConvert}</h5>
          </form>
        </div>
      </React.Fragment>
    )
  }
}

export default Converter;

