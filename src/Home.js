import React from 'react';
import { Dropdown, Selection } from 'react-dropdown-now';
import 'react-dropdown-now/style.css';
import { Link } from "react-router-dom";
import { json, checkStatus } from "./utils";

class CurrencyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      currencyList: [],
      currencyLeft: 'USD',
      currencyRight: 'EUR',
    };
    this.currencyLeftSelect = this.currencyLeftSelect.bind(this);
    this.currencyRightSelect = this.currencyRightSelect.bind(this);
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

  currencyLeftSelect (event) {
    this.setState({ currencyLeft: event.target.value });
  }

  currencyRightSelect (event) {
    this.setState({ currencyRight: event.target.value });
  }

  render() {
    const { currencyLeft, currencyRight, currencyList } = this.state;

    return (
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-10'>
            <h2 className='text-center my-5'>Convert</h2>

            <div className='row justify-content-center'>
              <div className='col-4'>
                <form className="dropdown" onSelect={this.currencyLeftSelect}>
                  <h4 className='text-center pb-4'>From</h4>
                  <Dropdown
                    placeholder="USD"
                    className="currency-left text-center"
                    options={currencyList}
                    value={currencyLeft}
                    
                  />
                  <input type='text' placeholder='$' step='0.01' min='0' max='9999999'
                  value={null}
                  onChange={null} 
                  />
                </form>
              </div>
              <div className='col-4 d-flex justify-content-center align-self-center'>
                <button style={{ fontSize: 50, background: 'none', border:'none'}}>  
                  <i class="fas fa-exchange-alt"></i>
                </button>
              </div>
              <div className='col-4 text-center'>
                <form className="dropdown" onSelect={this.currencyRightSelect}>
                  <h4 className='text-center pb-4'>From</h4>
                  <Dropdown
                    placeholder="AUD"
                    className="currency-right text-center"
                    options={currencyList}
                    value={currencyRight}
                    
                  />
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