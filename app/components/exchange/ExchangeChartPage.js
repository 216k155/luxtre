import React, { Component } from 'react';
import { observer } from 'mobx-react';

var ReactHighstock = require('react-highcharts/ReactHighstock');
var data = [[1520832000000, 22.56], [1520918400000, 21.67], [1521004800000, 21.66], [1521091200000, 21.81], [1521177600000, 21.28], [1521436800000, 20.05], [1521523200000, 19.98], [1521609600000, 18.26], [1521696000000, 19.16], [1521782400000, 20.13], [1522041600000, 18.72], [1522128000000, 18.12], [1522214400000, 18.39], [1522300800000, 18.85], [1522387200000, 18.32], [1522646400000, 15.04], [1522732800000, 16.24], [1522819200000, 15.59], [1522905600000, 14.3], [1522992000000, 13.87], [1523251200000, 14.02], [1523337600000, 12.74], [1523424000000, 12.83], [1523510400000, 12.68], [1523596800000, 13.8], [1523856000000, 15.75], [1523942400000, 14.87], [1524028800000, 13.99], [1524115200000, 14.56], [1524201600000, 13.91], [1524460800000, 14.06], [1524547200000, 13.07], [1524633600000, 13.84], [1524720000000, 14.03], [1524806400000, 13.77], [1525065600000, 13.16], [1525152000000, 14.27], [1525238400000, 14.94], [1525324800000, 15.86], [1525411200000, 15.37], [1525670400000, 15.28], [1525756800000, 15.86], [1525843200000, 14.76], [1525929600000, 14.16], [1526016000000, 14.03], [1526275200000, 13.7], [1526361600000, 13.54], [1526448000000, 12.87], [1526534400000, 13.78], [1526620800000, 12.89], [1526880000000, 12.59], [1526966400000, 12.84], [1527052800000, 12.33], [1527139200000, 11.5], [1527225600000, 11.8], [1527484800000, 13.28], [1527571200000, 12.97], [1527657600000, 13.57], [1527830400000, 13.24], [1528089600000, 12.7], [1528176000000, 13.21], [1528262400000, 13.7], [1528348800000, 13.06], [1528435200000, 13.43], [1528694400000, 14.25], [1528780800000, 14.29], [1528867200000, 14.03], [1528953600000, 13.57], [1529040000000, 14.04], [1529299200000, 13.54]];

/*
var config = {
  rangeSelector: {
    selected: 1
  },
  title: {
    text: 'LUX/BTC'
  },
  series: [{
    name: 'LUX',
    data: data,
    tooltip: {
      valueDecimals: 2
    }
  }]
};
*/
		// http://jsfiddle.net/UT2tr/1/
		let config = {
			chart: {
				type: "area",
				backgroundColor: 'transparent',
				height: 300
			//	borderColor: '#C0C0C0',
            //    borderWidth: 1,
            //    borderRadius: 0
			},
			title: {
				text: null
			},
			credits: {
				enabled: false
			},
			legend: {
				enabled: false
			},
			rangeSelector: {
			//	enabled: true
				inputEnabled: false,
                selected: 2,
                buttons: [{
                    type: 'minute',
                    count: 60,
                    text: '1 Hour'
                }, {
                    type: 'day',
                    count: 1,
                    text: '1 Day'
                }, {
                    type: 'week',
                    count: 1,
                    text: '1 Week'
                }, {
                    type: 'month',
                    count: 1,
                    text: '1 Month'
                }, {
                    type: 'year',
                    count: 1,
                    text: '1 Year'
                }, {
                    type: 'all',
                    text: 'All'
				}],
				buttonTheme: {
					width: 60,
					backgroundColor: '#445b7c'
				},
//                inputBoxStyle: {
//                    top: '40px',
//					right: '10px'
//				}
			},
			navigator: {
				enabled: false
			},
			navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
			scrollbar: {
				enabled: false
			},
			dataGrouping: {
				enabled: false
			},
			tooltip: {
				shared: false,
				backgroundColor: "rgba(0, 0, 0, 0.75)",
				useHTML: true,
				style: {
					color: "#FFFFFF"
				}
			},
			series: [{
					name: 'LUX',
					data: data,
					tooltip: {
						valueDecimals: 2
					},
				}
			],
			yAxis: {
				labels: {
					enabled: true,
					style: {
						color: "#fafbfc"
					},
				},
				opposite: false,
				title: {
					text: null,
					style: {
						color: "#FFFFFF"
					}
				},
				gridLineWidth: 1,
				gridLineColor: "rgba(196, 196, 196, 0.30)",
				gridZIndex: 1,
				crosshair: {
					snap: false
				},
				currentPriceIndicator: {
					enabled: false
				}
			},
			xAxis: {
				minRange: 3600 * 1000,
				labels: {
					style: {
						color:"#fafbfc"
					},
				},
				ordinal: false,
				lineColor: "#000000",
				title: {
					text: null
				},
				plotLines: []
			},
			plotOptions: {
				area: {
					animation: false,
					marker: {
						enabled: false
					},
					series: {
						enableMouseTracking: false
					}
				}
			}
		};


@observer

export default class ExchangeChartPage extends Component{

    render() {
        return (
             <div>
                <ReactHighstock ref="chart" config={config}/>
             </div>   
        );
    }
}

