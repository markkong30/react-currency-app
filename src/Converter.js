import React from 'react';
import { checkStatus, json } from './utils'
import './Converter.css'
import Chart from 'chart.js/auto';

class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currencyLeft: 'AUD',
      currencyRight: 'USD',
      amountInput: 1,
      amountAfterConvert: null,
    }
    this.currencyLeftSelect = this.currencyLeftSelect.bind(this);
    this.currencyRightSelect = this.currencyRightSelect.bind(this);
    this.amountInputHandler = this.amountInputHandler.bind(this);
    this.amountInputSubmit = this.amountInputSubmit.bind(this);
    this.sideSwap = this.sideSwap.bind(this);

    this.chartRef = React.createRef();
  }

  componentDidMount() {
    const { currencyLeft, currencyRight, amountInput } = this.state;
    this.getCurrencyOutput (currencyLeft, currencyRight, amountInput);
    this.getHistoricalRates(currencyLeft, currencyRight);
    document.querySelector('#converterRight').selectedIndex = 31;
  }

  getHistoricalRates(base, quote) {
    const message = document.querySelector('#no_chart');
    if (base === quote ) {
      message.innerHTML = ' No chart available for same base and quote ';
      return this.chart.destroy();
    }
    message.innerHTML = '';

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date((new Date).getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

    fetch(`https://altexchangerateapi.herokuapp.com/${startDate}..${endDate}?from=${base}&to=${quote}`)
      .then(checkStatus)
      .then(json)
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        const chartLabels = Object.keys(data.rates);
        const chartData = Object.values(data.rates).map(rate => rate[quote]);
        const chartLabel = `${base}/${quote}`;
        this.buildChart(chartLabels, chartData, chartLabel);
      })
      .catch(error => console.error(error.message));
  }

  buildChart = (labels, data, label) => {
    const chartRef = this.chartRef.current.getContext("2d");
    if (typeof this.chart !== "undefined") {
      this.chart.destroy();
    }
    this.chart = new Chart(this.chartRef.current.getContext("2d"), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: label,
            data,
            fill: false,
            tension: 0,
          }
        ]
      },
      options: {
        responsive: true,
      }
    })
  }

  getCurrencyOutput = (currencyLeft, currencyRight, amountInput) => {
    fetch(`https://altexchangerateapi.herokuapp.com/latest?from=${currencyLeft}&to=${currencyRight}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        let convert = (amountInput * data.rates[currencyRight]).toFixed(4);
        this.setState({ amountAfterConvert: convert });
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
      this.setState({ amountAfterConvert: amountInput });
      return this.getHistoricalRates(currencyLeft, currencyRight);
    }
    this.getHistoricalRates(currencyLeft, currencyRight);
    this.getCurrencyOutput (currencyLeft, currencyRight, amountInput);
  }

  currencyRightSelect(event) {
    const currencyRight = event.target.value;
    this.setState({ currencyRight });

    const { currencyLeft, amountInput } = this.state;
    if (currencyLeft == currencyRight) {
      this.setState({ amountAfterConvert: amountInput });
      return this.getHistoricalRates(currencyLeft, currencyRight);
    }
    this.getHistoricalRates(currencyLeft, currencyRight);
    this.getCurrencyOutput (currencyLeft, currencyRight, amountInput);
  }

  amountInputHandler(event) {
    const amountInput = event.target.value;
    const check = amountInput.length - amountInput.indexOf('.') - 1;
    if (check > 4 && amountInput.indexOf('.') !== -1) {
      return;
    } else if (amountInput.length > 12) {
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
    this.getCurrencyOutput (currencyLeft, currencyRight, amountInput);
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
    this.getHistoricalRates(currencyRight, currencyLeft);
    const left = document.querySelector('#converterLeft');
    const right = document.querySelector('#converterRight');
    const leftSave = left.selectedIndex;
    left.selectedIndex = right.selectedIndex;
    right.selectedIndex = leftSave;
  }

  render() {
    const { currencyList } = this.props;
    const { amountInput, amountAfterConvert } = this.state;
    const listMap = currencyList.map((currency) => {
      return <option key={currency} value={currency}>{currency}</option>
    });

    return (
      <React.Fragment>
        <div className='col-10 col-md-4'>
          <form className="form-group dropdown" onSubmit={this.amountInputSubmit}>
            <h4 className='text-center pb-4'>From</h4>

            <select className='form-control form-select text-center w-100' id="converterLeft" onChange={this.currencyLeftSelect}>
              {listMap}
            </select>
            
            <input className='form-control my-4 text-center w-100' type='number' placeholder='1.00' step='0.0001' min='0' max='9999999'
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
          <form className='form-group'>
            <h4 className='text-center pb-4'>To</h4>
            <select className='form-control form-select text-center w-100' id="converterRight" onChange={this.currencyRightSelect}>
              {listMap}
            </select>

            <h5 className='my-4'>{amountAfterConvert}</h5>
          </form>
        </div>

        <div className='col-12 col-md-10' id='chart'>
            <h2 className='text-center mt-5' id='no_chart'></h2>
            <canvas ref={this.chartRef} />
        </div>
      </React.Fragment>
    )
  }
}

export default Converter;

