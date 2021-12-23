import React from 'react';
import { json, checkStatus } from "./utils";
import './Home.css';
import Converter from './Converter';
import ExchangeTable from './ExchangeTable';

class CurrencyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      currencyList: [],
    }
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

  render() {
    const { currencyList } = this.state;
    if (currencyList.length == 0) {
      return <h1 className='text-center' id='error'>Server Error</h1>;
    }

    return (
      <div className='container-fluid'>
        <div className='row justify-content-center'>

          <div className='col-10' id='main_1'>
            <h2 className='text-center my-3 pb-5 pb-md-0'>Convert</h2>
            <div className='row justify-content-center'>
              <Converter currencyList={currencyList} />
            </div>
          </div>

          <div className='col-12 py-md-4' id='main_2'>
            <h2 className='text-center my-5'>Exchange Table</h2>
            <ExchangeTable currencyList={currencyList} />
          </div>
        </div>
      </div>
    )
  }
}

export default CurrencyApp;