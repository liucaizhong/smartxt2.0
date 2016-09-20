
var searchCondition = [[{
	key: 's1',
	value: '1'
}],[{
	key: 'o1',
	value: '1'
}],[{
	key: 'c1',
	value: '1'
}],[{
	key: 'i1',
	value: '1'
}]];

var searchKeyword = '';

$(document).ready(() => {
	$('#text-search').change((event) => {
		var target = event.target;
		if(target.value) {
			$('#btn-clear').show();
		}
		else {
			$('#btn-clear').hide();
		}
	});

	//loading more
	$(window).scroll(function() {
	  	if ($(window).scrollTop() + $(window).height() == $(document).height()) {
	  		//to do ajax
	  		$('#more-button span:nth-child(1)').removeClass('span-active');
	  		$('#more-button span:nth-child(2)').addClass('span-active');
	  	}
	});
});

function onFilterChange(that, event) {
	var target = event.target;

	if(target.tagName === 'DD') {
		var key = target.id;
		var value = $(target).attr('data-value');
		var whichCondition = 0;
		var ifRender = false;

		switch(key.substr(0,1)) {
			case 's':
				whichCondition = 0;
				break;
			case 'o':
				whichCondition = 1;
				break;
			case 'c':
				whichCondition = 2;
				break;
			case 'i':
				whichCondition = 3;
				break;
		}

		searchCondition[whichCondition].map((cur, index, arr) => {

			if(cur.key.substr(1,1) == '1') {
				if(cur.key != key) {
					$('#'+ cur.key).removeClass('active');
					$('#'+ key).addClass('active');
					arr.splice(index, 1, {
						key: key,
						value: value
					});
					ifRender = true;
					return;
				}
			}
			else {
				if(cur.key != key) {
					if(key.substr(1,1) == '1') {
						$('#'+ key).siblings().removeClass('active');
						$('#'+ key).addClass('active');
						arr.splice(index, arr.length, {
							key: key,
							value: value
						});
						ifRender = true;
						return;
					}
					else {
						$('#'+ key).addClass('active');
						arr.push({
							key: key,
							value: value
						});
						ifRender = true;
						return;
					}
				}
				else {
					if(arr.length == 1) {
						let id = cur.key.substr(0,1) + '1';
						let value = $(id).attr('data-value');
						$('#'+ cur.key).removeClass('active');
						$('#'+ id).addClass('active');
						arr.splice(index, 1, {
							key: id,
							value: value
						}); 
						ifRender = true;
						return;
					}
					else {
						$('#'+ cur.key).removeClass('active');
						arr.splice(index, 1);
						ifRender = true;
						return;
					}
				}
			}
		});
	}

	event.stopPropagation();

	if(ifRender) {
		_renderNewsList();
	}
}

function _renderNewsList() {

	//to do ajax
	
	console.log(searchCondition);
	console.log(searchKeyword);

	$('#loader').addClass('circle');

    $('#news-body').highlight(searchKeyword, {});

	setTimeout(()=>{
		$('#loader').removeClass('circle');
	}, 2000);
}

function onClear(that) {
	$('#text-search').val('');
	$(that).hide();
	searchKeyword = '';
	_renderNewsList();
}

function onSearch(that) {
	searchKeyword = $('#text-search').val();
	_renderNewsList();
}
