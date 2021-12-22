import React from 'react';
import { checkStatus, json } from './utils'

class ExchangeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currencyList: [],
      tableBase: 'AUD',
      tableRates: [],
    }
    this.tableSubmit = this.tableSubmit.bind(this);

    this.tableBaseSelect = this.tableBaseSelect.bind(this);

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
      });

    fetch(`https://altexchangerateapi.herokuapp.com/latest?from=${this.state.tableBase}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {

        const tableRates = Object.entries(data.rates);
        this.setState({ tableRates });
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      })
  }




  tableSubmit(event) {
    event.preventDefault();
  }


  tableBaseSelect(event) {
    const tableBase = event.target.value;
    this.setState({ tableBase });

    fetch(`https://altexchangerateapi.herokuapp.com/latest?from=${tableBase}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {

        const tableRates = Object.entries(data.rates);
        this.setState({ tableRates });
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      })



  }

  render() {

    const { currencyList, tableBase, currencyNames, currencyRates, tableRates } = this.state;

    return (
      <React.Fragment>
        <div className='row justify-content-center align-items-center'>
          <form className='col-6' onSubmit={this.tableSubmit}>

            <select className='text-center w-100'
              onChange={this.tableBaseSelect}>
              {currencyList.map((currency) => {
                return <option key={currency} value={currency}>{currency}</option>
              })}
            </select>

            <h1>1.00</h1>

          </form>

          <div className='col-6'>
            {tableRates.map((ele) => {
              return (
                <p>{ele[0]} : {ele[1]}</p>
              )
            })}
          </div>

        </div>
      </React.Fragment>
    )
  }
}

export default ExchangeTable;

