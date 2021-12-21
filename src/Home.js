import fx from 'money';
import React from 'react';

import { Link } from "react-router-dom";
import { json, checkStatus } from "./utils";

class CurrencyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      currencyList: [],
      currencyLeft: 'AUD',
      currencyRight: 'AUD',
      amountInput: 1,
      amountAfterConvert: 1,
    };
    this.currencyLeftSelect = this.currencyLeftSelect.bind(this);
    this.currencyRightSelect = this.currencyRightSelect.bind(this);
    this.amountInputHandler = this.amountInputHandler.bind(this);
    this.sideSwap = this.sideSwap.bind(this);
  };

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
    this.setState({ amountInput });

    const { currencyLeft, currencyRight } = this.state;
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

  sideSwap() {
    const { currencyLeft, currencyRight, amountInput, amountAfterConvert } = this.state;
    this.setState({
      currencyLeft: currencyRight,
      currencyRight: currencyLeft,
      amountInput: amountAfterConvert,
      amountAfterConvert: amountInput,
    })
    const left = document.querySelector('#convertorLeft');
    const right = document.querySelector('#convertorRight');
    const leftSave = left.selectedIndex;
    left.selectedIndex = right.selectedIndex;
    right.selectedIndex = leftSave;

  }

  render() {
    const { currencyLeft, currencyRight, currencyList, amountInput, amountAfterConvert } = this.state;

    return (
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-10'>
            <h2 className='text-center my-5'>Convert</h2>

            <div className='row justify-content-center'>
              <div className='col-4'>
                <form className="dropdown">
                  <h4 className='text-center pb-4'>From</h4>

                  <select className='text-center w-100' id="convertorLeft" onChange={this.currencyLeftSelect}>
                    {currencyList.map((currency) => {
                      return <option key={currency} value={currency}>{currency}</option>
                    })}
                  </select>

                  <input className='my-4 text-center w-100' type='number' placeholder='1.00' step='0.01' min='0' max='9999999'
                    value={amountInput}
                    onChange={this.amountInputHandler}
                  />
                </form>
              </div>
              <div className='col-4 d-flex justify-content-center align-self-center'>
                <button onClick={this.sideSwap} style={{ fontSize: 50, background: 'none', border: 'none' }}>
                  <i class="fas fa-exchange-alt"></i>
                </button>
              </div>
              <div className='col-4 text-center'>
                <form className="dropdown" onChange={this.currencyRightSelect}>
                  <h4 className='text-center pb-4'>To</h4>
                  <select className='text-center w-100' id="convertorRight" onChange={this.currencyRighttSelect}>
                    {currencyList.map((currency) => {
                      return <option key={currency} value={currency}>{currency}</option>

                    })}
                  </select>
                  <h5 className='my-4'>{amountAfterConvert}</h5>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CurrencyApp;