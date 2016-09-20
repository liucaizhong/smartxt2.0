
//echarts
var chartAttention = echarts.init(document.getElementById('chart-attention'), 'macarons');
var chartPrice = echarts.init(document.getElementById('chart-price'), 'macarons');
echarts.connect([chartAttention, chartPrice]);

$(document).ready(() => {
	$(window).on('resize',()=>{
		chartAttention.resize();
		chartPrice.resize();
	});
});

function onSubmit(that) {
	_renderChart(chartAttention, '/theme.json');
	_renderChart(chartPrice, '/theme.json');

}

function _renderChart(chart, url) {
	
	// configure echart
	chart.showLoading();
	$.ajax({
		url: url,
		success: (data) => {
			
            var heat = [];
            var index = [];
            var category = Object.keys(data.timeseries);
			for (let key in data.timeseries) {
				heat.push(data.timeseries[key].heat);
				index.push(data.timeseries[key].index);
			}							

			chart.setOption({
				baseOption: {
					title: {
						text: 'Heat Line'
					},
					tooltip: {
						trigger: 'axis'
					},
					dataZoom: [
			        {
			        	type: 'slider',
			            show: true,
			            xAxisIndex: [0],
			            start: 5,
			            end: 25
			        },{
			        	type: 'inside',
			            xAxisIndex: [0],
			            start: 5,
			            end: 25
			        }],
					legend: {
				        data:['Heat','Index']
				    },
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis: [{
						name: 'Date',
						type: 'category',
						data: category
					}],
					yAxis: [{
						name: 'Heat',
						type: 'value'
					},{
						name: 'Index',
						type: 'value'
					}],
					series: [{
						name: 'Heat',
						type: 'line',
						data: heat
					},{
						name: 'Index',
						type: 'line',
						data: index
					}]
				},
				media: [{
					option:{
						legend: {
	                        orient: 'horizontal',
	                        left: 'center',
	                        itemGap: 10
						},
						grid: {
						},
						xAxis: {
							nameLocation: 'end',
							nameGap: 10,
							splitNumber: 10,
							splitLine: {
								show: true
							}
						}
					}
				},{
	                query: {maxWidth: 670, minWidth: 550},
	                option: {
	                    legend: {
	                        orient: 'horizontal',
	                        left: 'center',
	                        itemGap: 5
	                    },
	                    grid: {
	                    },
	                    xAxis: {
	                        nameLocation: 'end',
	                        nameGap: 10,
	                        splitNumber: 5,
	                        splitLine: {
	                            show: true
	                        }
	                    }
	                }
	            },{
	                query: {maxWidth: 550},
	                option: {
	                    legend: {
	                        orient: 'vertical',
	                        left: 'right',
	                        itemGap: 5
	                    },
	                    grid: {
	                    },
	                    xAxis: {
	                        nameLocation: 'middle',
	                        nameGap: 25,
	                        splitNumber: 3
	                    }
	                }
	            }]
			});
			chart.hideLoading();
		},
		error: (err) => {
			console.log(err);
		}
	});
}