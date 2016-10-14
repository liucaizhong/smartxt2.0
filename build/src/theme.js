'use strict';

//define global params
var method = 0;
var methodRange = [0, 1];
var period = 0;
var periodRange = [0, 1, 2, 3, 4];
var source = [0];
var sourceRange = [0, 1, 2, 3];
var theme = [];
var themeCount = [3, 1];

//echarts
//var chart_attention = echarts.init(document.getElementById('chart-attention'), 'macarons');

$(document).ready(function () {

	//transfer data to json object
	if (window.themeRes && window.themeCond) {
		var themeRes = window.themeRes;
		delete window['themeRes'];
		themeRes = themeRes.replace(/&quot;+/g, '"').trim();
		var themeObj = JSON.parse(themeRes);

		var themeCond = window.themeCond;
		delete window['themeCond'];
		themeCond = themeCond.replace(/&quot;+/g, '"').trim();
		$.extend(themeObj, JSON.parse(themeCond));
		console.log(themeObj);
	}

	//datepicker initialization
	$('#datepicker').datetimepicker();
	var picker = $('#datepicker').data('datetimepicker');
	picker.setLocalDate(new Date());

	//echart resize handler
	$(window).on('resize', function () {
		chart_attention.resize();
	});

	//#form-theme submit handler
	$('#form-theme').submit(function (e) {
		e.preventDefault();
		console.log('start submit handler');
	});

	//_renderChartAttention(chart_attention, '/theme.json');
});

function onTriggerSlide(that) {
	var $trigger = $(that);
	var expand = $trigger.find('i.fa-angle-double-down')[0];
	var collapse = $trigger.find('i.fa-angle-double-up')[0];

	if (expand) {
		$(expand).removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
	}
	if (collapse) {
		$(collapse).removeClass('fa-angle-double-up').addClass('fa-angle-double-down');
	}

	$('.theme-conditions .container').slideToggle(1000);
}

function onMethod(that) {
	var $btn = $(that);
	var curMethod = $btn.attr('id')[1];
	if (method != curMethod) {
		method = curMethod;
		_setDefault();

		var btnSiblings = $btn.siblings('button[class*="btn-valid"]');
		Array.prototype.forEach.call(btnSiblings, function (cur) {
			$(cur).removeClass('btn-valid').addClass('btn-invalid');
		});

		$btn.removeClass('btn-invalid').addClass('btn-valid');
	}

	console.log('method:', method);
}

function _setDefault() {
	//set source
	var btnChilds = $('div#btnSource').find('button[class*="btn-valid"]');
	Array.prototype.forEach.call(btnChilds, function (cur) {
		$(cur).removeClass('btn-valid').addClass('btn-invalid');
	});
	var len = source.length;
	source.splice(0, len);

	//modify the display of source
	if (0 == method) {
		$('button#s0').removeClass('none').addClass('btn-valid').removeClass('btn-invalid');
		source[0] = '0';
	} else {
		$('button#s0').addClass('none');
		$('button#s1').removeClass('btn-invalid').addClass('btn-valid');
		source[0] = '1';
	}
	console.log('source:', source);

	//set theme
	var tagChilds = $('div#theme-tags').find('div[value="1"]');
	Array.prototype.forEach.call(tagChilds, function (cur) {
		$(cur).attr('value', '0').hide(500);
	});
	len = theme.length;
	theme.splice(0, len);
	console.log('theme', theme);
}

function onPeriod(that) {
	var $btn = $(that);
	var curPeriod = $btn.attr('id')[1];

	if (period != curPeriod) {
		period = curPeriod;
		var btnSiblings = $btn.siblings('button[class*="btn-valid"]');
		Array.prototype.forEach.call(btnSiblings, function (cur) {
			$(cur).removeClass('btn-valid').addClass('btn-invalid');
		});

		$btn.removeClass('btn-invalid').addClass('btn-valid');
	}

	console.log('period:', period);
}

function onSource(that) {
	if (0 == method) {
		var $btn = $(that);
		var curSource = $btn.attr('id')[1];
		if (source[0] != curSource) {
			source[0] = curSource;
			var btnSiblings = $btn.siblings('button[class*="btn-valid"]');
			Array.prototype.forEach.call(btnSiblings, function (cur) {
				$(cur).removeClass('btn-valid').addClass('btn-invalid');
			});

			$btn.removeClass('btn-invalid').addClass('btn-valid');
		}
	} else {
		var $btn = $(that);
		var curSource = $btn.attr('id')[1];
		var indexOfSource = source.indexOf(curSource);
		if (-1 == indexOfSource) {
			source.push(curSource);
			$btn.removeClass('btn-invalid').addClass('btn-valid');
		} else {
			source.splice(indexOfSource, 1);
			$btn.removeClass('btn-valid').addClass('btn-invalid');
		}
	}
	console.log('source:', source);
}

function addTheme(that) {
	var $input = $('input#theme-input');
	var keyword = $input.val();
	var count = themeCount[method];
	var len = theme.length;

	if (len >= count) {
		$input.val('');
		$('div#error-msg>strong').text('最多同时输入' + count + '个关键字');
		$('div#error-msg').show(500);
		return;
	}

	if (keyword) {
		$input.val('');
		theme.push(keyword);
		var themeTag = $('div#theme-tags div[value="0"]')[0];
		$(themeTag).attr('value', 1);
		var themeTxt = $(themeTag).find('span')[0];
		$(themeTxt).text(keyword);
		$(themeTag).show(500);
	}

	console.log('theme', theme);
}

function delThemeTag(that) {
	var $btn = $(that);
	var btnId = $btn.attr('id')[1];
	var themeTag = $btn.parent();
	var themeText = $btn.siblings('span')[0];
	var indexOfTheme = theme.indexOf($(themeText).text());
	$(themeTag).attr('value', 0);
	theme.splice(indexOfTheme, 1);
	$(themeTag).hide(500);

	console.log('theme', theme);
}

function delAlert(that) {
	var $btn = $(that);
	var parentId = $($btn.parent()).attr('id');
	$('div#' + parentId).hide(500);
}

function _renderChartAttention(chart, url) {
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
					xAxis: {
						name: 'Date',
						type: 'category',
						data: category
					},
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