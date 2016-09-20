'use strict';

$(document).ready(function () {
	_render($('dd#f1'));
});

function onFocus(that, event) {
	_active(that, event);
}

function _active(that, event) {

	var target = event.target;
	if (target.tagName != 'DT' && target.tagName != 'DL') {
		var options = that.querySelectorAll("dd[class~=color]");

		if (options && options.length) {
			var pre = options[0];
			if (target !== pre) {
				$(pre).removeClass('color');
				$(target).addClass('color');
				_render($(target));
			}
		} else {
			$(target).addClass('color');
			_render($(target));
		}
	}
	event.stopPropagation();
}

function _render(element) {
	//ajax get data
	//render content
}