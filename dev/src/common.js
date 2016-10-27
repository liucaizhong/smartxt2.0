// for use in the future
$(document).ready(() => {
//     // load i18n at first
//     var lang = navigator.language;
//     var path = '/i18n/';
//     switch (lang) {
//         case 'zh-CN':
//         case 'en':
//             $.ajax({
//                 url: path + lang + '.json',
//                 async: false,
//                 success: (data) => {
//                     i18n.translator.add(data);
//                 },
//                 error: (err) => {
//                     console.log(err);
//                 }
//             });
//             break;
//         default:
//             $.ajax({
//                 url: path + 'zh-CN.json',
//                 async: false,
//                 success: (data) => {
//                     i18n.translator.add(data);
//                 },
//                 error: (err) => {
//                     console.log(err);
//                 }
//             });
//     };

    /* ======= Twitter Bootstrap hover dropdown ======= */   
    /* Ref: https://github.com/CWSpear/bootstrap-hover-dropdown */ 
    /* apply dropdownHover to all elements with the data-hover="dropdown" attribute */

    // $('[data-hover="dropdown"]').dropdownHover();
    
    /* ======= jQuery Placeholder ======= */
    /* Ref: https://github.com/mathiasbynens/jquery-placeholder */
    
    $('input, textarea').placeholder();    

    // hover show QRcode for weixin 
    // apple to do .....
    $('.weixin').hover(function(e) {
        // console.log(e);
        var top = e.pageY - 200;
        var left = e.pageX - 80;
        var qrCode = document.createElement('IMG');
        qrCode.id = 'weixin-qr';
        qrCode.src = '../img/icon/weixin.jpg';
        $(qrCode).css({
            'display':'block',
            'position': 'absolute',
            'top': top,
            'left': left
        });
        
        $('body').append(qrCode);
    }, function(e) {
        $('img').remove('#weixin-qr');
    });

    //hover event
    $('[data-hover="dropdown"]').hover(function(e) {
        // console.log('hover start!');
        var $this = $(this);
        $this.find('div.dropdown-menu').css('display', 'block');
    }, function(e) {
        // console.log('hover stop!');
        var $this = $(this);
        var div = $this.find('div')[0];
        var num = $(div).children().length + 1;
        var top = $this.offset().top;
        var left = $this.offset().left;
        var width = left + 100;
        var height = top + num*60;
        var clientX = e.pageX;
        var clientY = e.pageY;
        
        if(clientX <= left || clientX >= width || clientY <= top || clientY >= height) {
            $this.find('div.dropdown-menu').css('display', 'none');
        }
    });
});

//load highlight function to jQuery
$.fn.extend({
    highlight: function(keyword, config) {
        if (typeof(keyword) == 'undefined') return;
        var config = $.extend({
            insensitive: true,
            hlClass: 'highlight',
            clearLast: true
        }, config);
        if (config.clearLast) {
            $(this).find("strong." + config.hlClass).each(function() {
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
        var regex = new RegExp("(<[^>]*>)|(" + query + ")", config.insensitive ? "ig" : "g");
        this.html(this.html().replace(regex, function(a, b, c) {
            return (a.charAt(0) == "<") ? a : "<strong class=\"" + config.hlClass + "\">" + c + "</strong>";
        }));
    },
    unicode: function(s) {
        var len = s.length;
        var rs = '';
        s = s.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
        for (let i = 0; i < len; i++) {
            if (s.charCodeAt(i) > 255) rs += "\\u" + s.charCodeAt(i).toString(16);
            else rs += s.charAt(i);
        }
        return rs;
    }
});