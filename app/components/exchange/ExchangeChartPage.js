// @flow

// https://codesandbox.io/s/github/rrag/react-stockcharts-examples2/tree/master/examples/CandleStickChartWithUpdatingData

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import data from './chartdata';
import { timeParse } from 'd3-time-format';
import Chart from './Chart';

import type { LGPrice } from '../../domain/LGPriceArray';

const ReactHighstock = require('react-highcharts/ReactHighstock');

type Props = {
  data: Array<LGPrice>
};

@observer
export default class ExchangeChartPage extends Component<Props> {
  render() {
    // d.date = parse(d.date);
    // d.open = +d.open;
    // d.high = +d.high;
    // d.low = +d.low;
    // d.close = +d.close;
    // d.volume = +d.volume;
    const parseDate = timeParse('%Y-%m-%d');
    // this.props.data
    const chartData = data.map(priceArray => ({
      timestamp: priceArray[0],
      high: priceArray[1],
      low: priceArray[2],
      open: priceArray[3],
      close: priceArray[4],
      relvolume: priceArray[5],
      basevolume: priceArray[6],
      numtrades: priceArray[7]
    }));

    const myData = chartData.map(lgPrice => {
      const myDate = new Date(lgPrice.timestamp);
      const parsedTime = parseDate(myDate);
      return {
        date: myDate,
        open: lgPrice.open,
        high: lgPrice.high,
        low: lgPrice.low,
        close: lgPrice.close,
        volume: lgPrice.basevolume // I guess? or ( sum base rel / 2 )?
      };
    });

    return <Chart type="hybrid" data={myData} />;

    // {
    //   /* return <ReactHighstock ref="chart" config={config} />; */
    // }
  }
}
