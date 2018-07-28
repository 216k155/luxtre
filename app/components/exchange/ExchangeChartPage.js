// @flow

// https://codesandbox.io/s/github/rrag/react-stockcharts-examples2/tree/master/examples/CandleStickChartWithUpdatingData

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import data from './chartdata';
import { timeParse } from 'd3-time-format';

import type { LGPrice } from '../../domain/LGPriceArray';

const ReactHighstock = require('react-highcharts/ReactHighstock');

type Props = {
  data: Array<LGPrice>
};

@observer
export default class ExchangeChartPage extends Component<Props> {
  render() {
    let price = [],
      volume = [],
      dataLength = data.length,
      groupingUnits = [['week', [1]], ['month', [1, 2, 3, 4, 6]]],
      i = 0;

    for (i; i < dataLength; i += 1) {
      price.push([
        data[i][0], // the date
        data[i][1], // open
        data[i][2], // high
        data[i][3], // low
        data[i][4] // close
      ]);

      volume.push([
        data[i][0], // the date
        data[i][5] // the volume
      ]);
    }

    const config = {
      chart: {
        backgroundColor: '#fafbfc',
        style: {
          fontFamily: 'default'
        }
      },
      credits: {
        enabled: false
      },
      scrollbar: {
        enabled: false
      },
      title: {
        text: 'LUX/BTC Historical',
        style: {
          fontWeight: 'bold',
          textTransform: 'capitalize'
        }
      },
      rangeSelector: {
        inputEnabled: false,
        selected: 4,
        buttons: [
          {
            type: 'minute',
            count: 60,
            text: '1h'
          },
          {
            type: 'day',
            count: 1,
            text: '1d'
          },
          {
            type: 'week',
            count: 1,
            text: '1w'
          },
          {
            type: 'month',
            count: 1,
            text: '1m'
          },
          {
            type: 'year',
            count: 1,
            text: '1y'
          },
          {
            type: 'all',
            text: 'All'
          }
        ],
        buttonTheme: {
          width: 30,
          backgroundColor: '#445b7c'
        }
      },
      plotOptions: {
        candlestick: {
          oxymoronic: false,
          animation: false,
          color: '#ee5f5b',
          lineColor: '#ee5f5b',
          upColor: '#4e804e',
          upLineColor: '#4e804e',
          lineWidth: 1
        },
        column: {
          animation: false,
          borderColor: '#000000'
        },
        series: {
          marker: {
            enabled: false
          },
          enableMouseTracking: true
        }
      },
      yAxis: [
        {
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'Price'
          },
          height: '65%',
          lineWidth: 2,
          resize: {
            enabled: true
          }
        },
        {
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'Volume'
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2
        }
      ],

      xAxis: {
        type: 'datetime',
        minRange: 3600 * 1000,
        gridLineWidth: 1,
        lineWidth: 1,
        // lineColor: '#0000FF',
        // labels: {
        //    style: {
        //        color: '#00FFFF'
        //    }
        // },
        title: {
          text: null
        },
        plotLines: []
      },

      tooltip: {
        split: true,
        borderWidth: 0,
        backgroundColor: 'rgba(219,219,216,0.8)',
        shadow: false
      },

      series: [
        {
          type: 'candlestick',
          name: 'price',
          data: price,
          dataGrouping: {
            units: groupingUnits
          }
        },
        {
          type: 'column',
          name: 'Volume',
          // color: '#7cb5ec',
          data: volume,
          yAxis: 1,
          dataGrouping: {
            units: groupingUnits
          }
        }
      ],

      navigator: {
        maskFill: 'rgba(255, 255, 255, 0.45)',
        series: {
          type: 'areaspline',
          color: 'rgba(255, 255, 255, 0.00)',
          fillOpacity: 0.4,
          dataGrouping: {
            smoothed: false
          },
          lineWidth: 2,
          lineColor: '#7cb5ec',
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [[0, '#d3ddf3'], [1, '#acc4f7']]
          },
          marker: {
            enabled: false
          },
          shadow: true
        },
        yAxis: {
          lineWidth: 0
          //    reversed: true
        },
        xAxis: {
          plotBands: [
            {
              color: '#fff',
              from: -Infinity,
              to: Infinity
            }
          ]
        }
      }
    };
    // d.date = parse(d.date);
    // d.open = +d.open;
    // d.high = +d.high;
    // d.low = +d.low;
    // d.close = +d.close;
    // d.volume = +d.volume;
    const parseDate = timeParse('%Y-%m-%d');
    const chartData = this.props.data.map(lgPrice => ({
      date: parseDate(String(lgPrice.timestamp)),
      open: lgPrice.open,
      high: lgPrice.high,
      low: lgPrice.low,
      close: lgPrice.close,
      volume: lgPrice.basevolume // I guess? or ( sum base rel / 2 )?
    }));

    // return this.props.data ? <ReactStockChart data={chartData}> : <p>Loading...</p>

    return <ReactHighstock ref="chart" config={config} />;
  }
}
