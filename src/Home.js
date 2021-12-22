import fx from 'money';
import React from 'react';
import { Link } from "react-router-dom";
import { json, checkStatus } from "./utils";
import './Home.css';
import ConvertorLeft from './ConvertorLeft';
import ConvertorRight from './ConvertorRight';
import ExchangeTable from './ExchangeTable';

class CurrencyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      currencyLeft: 'AUD',
      currencyRight: 'AUD',
      amountInput: 1,
      amountAfterConvert: 1,
      
    };
    this.currencyLeftSelect = this.currencyLeftSelect.bind(this);
    this.currencyRightSelect = this.currencyRightSelect.bind(this);
    this.amountInputHandler = this.amountInputHandler.bind(this);
    this.amountInputSubmit = this.amountInputSubmit.bind(this);
    this.sideSwap = this.sideSwap.bind(this);
  };



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

          <div className='col-10' id='main_1'>
            <h2 className='text-center my-3 pb-5 pb-md-0'>Convert</h2>
            <div className='row justify-content-center'>
              <ConvertorLeft currencyLeftSelect={this.currencyLeftSelect} amountInputSubmit={this.amountInputSubmit} amountInputHandler={this.amountInputHandler} amountInput={amountInput} />

              <ConvertorRight currencyRightSelect={this.currencyRightSelect} sideSwap={this.sideSwap} amountAfterConvert={amountAfterConvert} />
            </div>
          </div>

          <div className='col-10' id='main_2'>
          <h2 className='text-center my-3 pb-5 pb-md-0'>Exchange Table</h2>
            <ExchangeTable />


            
          </div>
        </div>
      </div>
    )
  }
}

export default CurrencyApp;