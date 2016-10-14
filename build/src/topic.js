'use strict';

//which collection
var whichCollection = {};
//echarts
// var chartAttention = echarts.init(document.getElementById('chart-attention'), 'macarons');
// var chartPrice = echarts.init(document.getElementById('chart-price'), 'macarons');
// echarts.connect([chartAttention, chartPrice]);

$(document).ready(function () {
	//echart resize
	$(window).on('resize', function () {
		chartAttention.resize();
		chartPrice.resize();
	});

	//form submit 
	$('#form-topic').submit(function (e) {
		e.preventDefault();
		console.log('start submit handler');

		onCollection($('#btn-collapse'));
		var collections = $('div.collections').find('div.btn-valid');
		Array.prototype.forEach.call(collections, function (cur) {
			$(cur).removeClass('btn-valid').addClass('btn-invalid');
		});
	});
});

function onStar(that) {
	var $btn = $(that);
	$btn.toggleClass('collect');

	//add event to collection
	//to do
}

function onCollection(that) {
	var $trigger = $(that);

	if ($trigger.hasClass('fa-angle-double-down')) {
		$trigger.removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
	} else if ($trigger.hasClass('fa-angle-double-up')) {
		$trigger.removeClass('fa-angle-double-up').addClass('fa-angle-double-down');
	}

	//show collection
	//to do later
	//ajax get collections

	$('div.collections').css({ "display": "table" });
	$('div.collections>*').slideToggle(1000);
}

function delStar(that) {
	//undo collect
	var $btn = $(that);
	whichCollection = that;
	$btn.toggleClass('undo-collect');

	$('div#info-msg').show(500);
}

function onCheckCollection(that) {
	//check collection
	var parent = $(that).parent();
	$(parent).removeClass('btn-invalid').addClass('btn-valid');

	//ajax get show echarts
	//to do later
}

function delCollection(that) {
	var collection = $(whichCollection).parent().parent();
	whichCollection = {};
	//ajax post delete collection in the database
	//to do later

	collection.remove();
	$('div#info-msg').hide(500);
}

function delAlert(that) {
	var parent = $(that).parent();
	$(parent).hide(500);

	if (whichCollection) {
		$(whichCollection).toggleClass('undo-collect');
		whichCollection = {};
	}
}

function onSubmit(that) {}

function _renderChart(chart, url) {

	// configure echart
	chart.showLoading();
	$.ajax({
		url: url,
		success: function success(data) {

			var heat = [];
			var index = [];
			var category = Object.keys(data.timeseries);
			for (var key in data.timeseries) {
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
					dataZoom: [{
						type: 'slider',
						show: true,
						xAxisIndex: [0],
						start: 5,
						end: 25
					}, {
						type: 'inside',
						xAxisIndex: [0],
						start: 5,
						end: 25
					}],
					legend: {
						data: ['Heat', 'Index']
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
					}, {
						name: 'Index',
						type: 'value'
					}],
					series: [{
						name: 'Heat',
						type: 'line',
						data: heat
					}, {
						name: 'Index',
						type: 'line',
						data: index
					}]
				},
				media: [{
					option: {
						legend: {
							orient: 'horizontal',
							left: 'center',
							itemGap: 10
						},
						grid: {},
						xAxis: {
							nameLocation: 'end',
							nameGap: 10,
							splitNumber: 10,
							splitLine: {
								show: true
							}
						}
					}
				}, {
					query: { maxWidth: 670, minWidth: 550 },
					option: {
						legend: {
							orient: 'horizontal',
							left: 'center',
							itemGap: 5
						},
						grid: {},
						xAxis: {
							nameLocation: 'end',
							nameGap: 10,
							splitNumber: 5,
							splitLine: {
								show: true
							}
						}
					}
				}, {
					query: { maxWidth: 550 },
					option: {
						legend: {
							orient: 'vertical',
							left: 'right',
							itemGap: 5
						},
						grid: {},
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
		error: function error(err) {
			console.log(err);
		}
	});
}