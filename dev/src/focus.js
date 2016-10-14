//global
var method = 0;
var methodRange = [0,1,2,3];
var period = 0;
var periodRange = [0,1,2];
var source = 0;
var sourceRange = [0,1,2,3];

//echarts
var charts = [];

$(document).ready(() => {
	//echart resize handler
	$(window).on('resize',()=>{
		charts.forEach(function(cur) {
			$('#'+cur).resize();
		});
	});
});

function onForm(that) {
	event.stopPropagation();

	var target = event.target;

	if(target.tagName === 'BUTTON') {
		var $btn = $(target);
		var category = $btn.attr('id');
		var update = false;

		switch(category[0]) {
			case 'm':
				if(method != category[1]) {
					method = category[1];
					update = true;
				}
				break;
			case 'p':
				if(period != category[1]) {
					period = category[1];
					update = true;
				}
				break;
			case 's':
				if(source != category[1]) {
					source = category[1];
					update = true;
				}
				break;
		}
		
		if(update) {
			//change button style
			var btnSiblings = $btn.siblings('button[class*="btn-valid"]');
			Array.prototype.forEach.call(btnSiblings, function(cur) {
				$(cur).removeClass('btn-valid').addClass('btn-invalid');
			});

			$btn.removeClass('btn-invalid').addClass('btn-valid');
			//ajax get and render charts
			//to do later
			console.log('ajax get focus data!');
			console.log(method, period, source);
		}
	}
}

function delAlert(that) {
	var $btn = $(that);
	var parentId= $($btn.parent()).attr('id');
	$('div#'+parentId).hide(500);
}

function loadMore(that) {
	var $btn = $(that);
	$btn.text('加载中...');

	//ajax get and render
	// for test
	for(var i = 0; i< 3;i++) {
		var chartDiv = document.createElement('div');
		$(chartDiv).attr('id','c'+ charts.length).addClass('col-xs-12').addClass('col-lg-6').addClass('focus-chart');
		charts.push($(chartDiv).attr('id'));

		//set option for chart
		//to do later
		var chart = echarts.init(chartDiv, 'macarons');
		
		$('charts>div.container').append(chartDiv);
	}
	$btn.text('浏览更多');
	console.log('charts', charts);
}

function _renderCharts(data) {
	var json = JSON.parse(data);
	//create element
	for (var i = json.length - 1; i >= 0; i--) {
		var chartDiv = document.createElement('div');
		$(chartDiv).attr('id','c'+ charts.length).addClass('col-xs-12').addClass('col-lg-6').addClass('focus-chart');
		charts.push($(chartDiv).attr('id'));
		console.log('charts', charts);

		//set echart option
		//to do later
		var chart = echarts.init(chartDiv, 'macarons');
		
		$('charts>div.container').append(chartDiv);
	}
}

