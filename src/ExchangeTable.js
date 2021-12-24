import React from 'react';
import { checkStatus, json } from './utils';
import './ExchangeTable.css';

class ExchangeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableBase: 'AUD',
      tableRatesLeft: [],
      tableRatesRight: [],
    }
    this.tableBaseSelect = this.tableBaseSelect.bind(this);
  }

  componentDidMount() {
    fetch(`https://altexchangerateapi.herokuapp.com/latest?from=${this.state.tableBase}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        const tableRates = Object.entries(data.rates);
        const tableRatesLeft = tableRates.slice(0,16);
        const tableRatesRight = tableRates.slice(16);
        
        this.setState({ tableRatesLeft, tableRatesRight });
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      })
  }

  tableBaseSelect(event) {
    const tableBase = event.target.value;
    this.setState({ tableBase });

    fetch(`https://altexchangerateapi.herokuapp.com/latest?from=${tableBase}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        const tableRates = Object.entries(data.rates);
        const tableRatesLeft = tableRates.slice(0,16)
        const tableRatesRight = tableRates.slice(16)

        this.setState({ tableRatesLeft, tableRatesRight });
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      })
  }

  render() {
    const { currencyList } = this.props;
    const { tableRatesLeft, tableRatesRight } = this.state;

    return (
      <React.Fragment>
        <div className='row justify-content-center'>
          <form className='col-4 col-md-3'>
            <select className='form-control form-select text-center w-100'
              onChange={this.tableBaseSelect}>
              {currencyList.map((currency) => {
                return <option key={currency} value={currency}>{currency}</option>
              })}
            </select>
            <h1 className='py-5 text-center'>1.00</h1>
          </form>

          <div className='col-4 col-md-3 offset-md-1'>
            {tableRatesLeft.map((ele) => {
              return <p className='exchange_items' key={tableRatesLeft.indexOf(ele)}>{ele[0]} :&ensp; <span className='rates'>{ele[1]}</span></p>
            })}
          </div>

          <div className='col-4 col-md-3'>
            {tableRatesRight.map((ele) => {
              return <p className='exchange_items' key={tableRatesRight.indexOf(ele)}>{ele[0]} :&ensp; <span className='rates'>{ele[1]}</span></p>
            })}
          </div>

        </div>
      </React.Fragment>
    )
  }
}

export default ExchangeTable;

