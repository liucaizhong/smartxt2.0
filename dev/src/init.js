
// load i18n
(function(){
	var lang = navigator.language;
	var path = '/i18n/';

	switch(lang) {
		case 'zh-CN': 
		case 'en':
			$.ajax({
				url: path + lang + '.json',
				async: false,
				success: (data) => {
					i18n.translator.add(data);
				},
				error: (err) => {
					console.log(err);
				}
			});
			break;
		default:
			$.ajax({
				url: path + 'zh-CN.json',
				async: false,
				success: (data) => {
					i18n.translator.add(data);
				},
				error: (err) => {
					console.log(err);
				}
			});
	};
})();

//highlight
(function($) {
$.fn.extend({
	highlight: function(keyword, config) {
		if(typeof(keyword) == 'undefined') return;

		var config = $.extend({
			insensitive: true,
			hlClass: 'highlight',
			clearLast: true
		}, config);

		if(config.clearLast) {  
  
            $(this).find("strong."+config.hlClass).each(function(){   
  
                $(this).after($(this).text());  
  
                $(this).remove();   
  
            })  
  
        }  

		return this.each((index, element) => {
			$(element).highregx(keyword, config);
		});
	},

	highregx: function(query, config) {
		query = this.unicode(query);  
  
        var regex = new RegExp("(<[^>]*>)|("+ query +")", config.insensitive ? "ig" : "g");         
  
        this.html(this.html().replace(regex, function(a, b, c){  
  
            return (a.charAt(0) == "<") ? a : "<strong class=\""+ config.hlClass +"\">" + c + "</strong>";  
  
        })); 
	},

	unicode: function(s) {
		var len = s.length;   
  
        var rs = '';   
  
        s = s.replace(/([-.*+?^${}()|[\]\/\\])/g,"\\$1");  
  
        for(let i=0; i<len; i++) {  
  
            if(s.charCodeAt(i) > 255)  
                rs+="\\u"+ s.charCodeAt(i).toString(16);  
            else 
            	rs +=  s.charAt(i);  
        }     
  
        return rs;   
	}
})})(jQuery);
