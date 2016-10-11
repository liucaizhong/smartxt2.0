
var theme = [];
var method = [];
var source = [];
var period = [];
var type = 0;
var max = [5,1];
const ALL = '1';
//echarts
//var chart_attention = echarts.init(document.getElementById('chart-attention'), 'macarons');

$(document).ready(() => {

	//transfer data to json object
	if(window.themeRes && window.themeCond) {
		var themeRes = window.themeRes;
		delete window['themeRes'];
		themeRes = themeRes.replace(/&quot;+/g,'"').trim();
		var themeObj = JSON.parse(themeRes);

		var themeCond = window.themeCond;
		delete window['themeCond'];
		themeCond = themeCond.replace(/&quot;+/g,'"').trim();
		$.extend(themeObj, JSON.parse(themeCond));
		console.log(themeObj);
	}

	$('#theme').change((event) => {
		if(event.target.value) {
			$('#btn_theme').removeClass('disabled');
		} else {
			$('#btn_theme').addClass('disabled');
		}
	});

	$('#d1').change((event) => {
		if(event.target.value) {
			_hideMsg($('#dMsg'));
		}
	});

	$(window).on('resize',()=>{
		chart_attention.resize();
	});

	//_renderChartAttention(chart_attention, '/theme.json');
});

function onMethod(that, event) {
	_active(that,event);
	$('div#option dd.color').removeClass();
	$('#theme').val('');
	$('#theme_list').slideUp();
	$('#tMsg').hide().text('');
	$('#sMsg').hide().text('');
	$('#dMsg').hide().text('');
	$('#pMsg').hide().text('');
	$('#option').slideDown();
	type = method[0];
}

function onTheme(that) {
		var element = null;
		var len = $('dl#theme_chosen dd').length + 1;
		var num = max[type-1] - len + 1;
		var input = $('#theme').val();
		$('#theme').val('');
		$('#btn_theme').attr('disabled',true);
		if(num) {
			element = document.createElement('dd');
			$(element).attr('id', 't' + len).text(input).attr('data-value', input);
			$(element).addClass('chosenTheme');
			$('#theme_chosen').append(element);
			_addCondition($(element));
			num--;
		} else {
			$('#tMsg').text('too much').show();
		}
		if(num < max[0]) {
			$('#theme_list').slideDown();
		}
}

function onThemeChosen(that, event) {
	var target = event.target;
	if(target.tagName != 'DT' && target.tagName != 'DL') {
		$(target).remove();

		var index = -1;
		theme.forEach((cur, i) => {
			if($(target).attr('data-value') === cur) {
				index = i;
				return;
			}
		});
		_removeCondition($(target), index);

		if(!$('#theme_chosen dd').length) {
			$('#theme_list').slideUp();
		}
	}
	event.stopPropagation();
}

function onSource(that, event) {
	if(1 == type) {
		_active(that, event);
	}
	else if(2 == type) {
		_setSource(that, event);

	}
}

function onPeriod(that, event) {
	_active(that, event);
}

function _setSource(that, event) {
	var target = event.target;
	if(target.tagName != 'DT' && target.tagName != 'DL') {
		var index = -1;
		var targetValue = $(target).attr('data-value');
		var len = source.length;

		source.forEach((cur, i) => {
			if(targetValue === cur) {
				index = i;
				return;
			}
		});

		if(-1 == index) {
			var indexAll = source.indexOf(ALL);
			
			if(indexAll !== -1) {
				$('#s1').removeClass('color');
				_removeCondition($('#s1'), indexAll);
			}
			if(targetValue === ALL) {
				Array.prototype.map.call(that.querySelectorAll("dd[class~=color]"),(item)=>{
					$(item).removeClass('color');
				});
				source.splice(0,len);
			}
			$(target).addClass('color');
			_addCondition($(target));
		} else {
			$(target).removeClass('color');
			_removeCondition($(target), index);
		}
	}

	event.stopPropagation();
}

function _active(that, event) {

	var target = event.target;
	if(target.tagName != 'DT' && target.tagName != 'DL') {
		var options = that.querySelectorAll("dd[class~=color]");

		if(options && options.length) {
			var pre = options[0];
			if(target !== pre) {
				$(pre).removeClass('color');
				_removeCondition($(target));
				$(target).addClass('color');
				_addCondition($(target));
			}
		} else {
			$(target).addClass('color');
			_addCondition($(target));
		}
	}
	event.stopPropagation();
}

function _addCondition(element) {
	var id = element.attr('id');
	var value = element.attr('data-value');
	switch(id.substr(0,1)) {
		case 'p':
			period.push(value);
			break;
		case 'm':
			method.push(value);
			break;
		case 's':
			source.push(value);
			break;
		case 't':
			theme.push(value);
			break;
	}
	var msg = '#' + id.substr(0,1) + 'Msg';
	_hideMsg($(msg));
}

function _removeCondition(element, index) {
	var id = element.attr('id');
	switch(id.substr(0,1)) {
		case 'p':
			period.shift();
			break;
		case 'm':
			method.shift();
			break;
		case 's':
			if(index == undefined) {
				source.shift();
			}
			else {
				source.splice(index,1);
			}
			break;
		case 't':
			theme.splice(index,1);
			break;
	}
}

function _hideMsg(element) {
	if(element.css('display') != 'none') {
		element.hide();
	}
}

function onSubmit() {

	if(!theme.length) {
		$('#tMsg').text('empty not allowed').show();
	}
	if(!source.length) {
		$('#sMsg').text('empty not allowed').show();
	}
	var date = $('#d1').val();
	if(!date) {
		$('#dMsg').text('empty not allowed').show();
	}
	if(!period.length) {
		$('#pMsg').text('empty not allowed').show();
	}

	//to do ajax
	// $.ajax({
	// 	url:,
	// 	type: 'GET',
	// 	success: ,
	// 	error:
	// });
}

function _renderChartAttention(chart, url) {
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
					xAxis: {
						name: 'Date',
						type: 'category',
						data: category
					},
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