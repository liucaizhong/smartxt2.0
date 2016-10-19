'use strict';

//define global params
var method = 0;
var methodRange = [0, 1];
var period = 0;
var periodRange = [0, 1, 2, 3, 4];
var source = [0];
var sourceRange = ['*', 'guba', 'report OR announce', 'news'];
var theme = [];
//echarts
var lineChart = echarts.init(document.getElementById('line-chart'), 'macarons');
var histogram = echarts.init(document.getElementById('histogram'), 'macarons');
//ajax url
//example: concept=NB-IoT&src=*&response=application/json
var URL = '139.196.18.233:8087/axis2/services/smartxtAPI/getHeat?';
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
        lineChart.resize();
        histogram.resize();
    });
    //#form-theme submit handler
    $('#form-theme').submit(function (e) {
        e.preventDefault();
        console.log('start submit handler');
        //check date-input whether empty
        var inputDate = $('#date-input').val();
        if (!inputDate) {
            _showErr('回溯日期不能为空!');
            return;
        }
        //check source whether empty
        else if (!source.length) {
                _showErr('关注人群不能为空!');
                return;
            }
            //check theme whether empty
            else if (!theme.length) {
                    _showErr('主题信息不能为空!');
                    return;
                } else {
                    _hideErr();
                }

        //generate new URL
        var url = _genUrl();
        console.log('url', url);

        //ajax get request
        $.ajax({
            url: url,
            type: 'GET',
            async: true,
            dataTyle: 'json',
            success: function success(data) {
                console.log('data', data);
                //render line chart
                // _renderLineChart(lineChart, data);
            },
            error: function error(err) {
                console.log(err);
            }
        });
    });
});

function _genUrl() {
    var url = URL;
    var urlTheme = 'concept=';
    var urlSource = 'src=';
    //add theme to url
    theme.forEach(function (cur) {
        urlTheme += cur.trim() + ',';
    });
    //remove comma at the end of str
    urlTheme = urlTheme.substr(0, urlTheme.length - 1);
    //add source to url
    source.forEach(function (cur) {
        urlSource += sourceRange[cur].trim() + ',';
    });
    //remove comma at the end of str
    urlSource = urlSource.substr(0, urlSource.length - 1);

    url = url + urlTheme + '&' + urlSource + '&response=application/json';

    return url;
}

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
    $('button#s0').addClass('btn-valid').removeClass('btn-invalid');
    source[0] = '0';
    console.log('source:', source);
    //set theme
    if (method == 2) {
        $('#theme-input').attr('placeholder', '支持主题交叉搜索(半角分号隔开),例如“钢铁;煤炭”');
    } else {
        $('#theme-input').attr('placeholder', '输入关键字用于描述要查询的主题信息,例如 “钢铁”');
    }
    var tagChilds = $('div#theme-tags').empty();
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

function _showErr(text) {
    $('div#error-msg>strong').text(text);
    $('div#error-msg').show(500);
}

function _hideErr() {
    $('div#error-msg').hide(500);
}

function addTheme(that) {
    var $input = $('input#theme-input');
    var keyword = $input.val();

    if (method != 0 && theme.length >= 1) {
        $input.val('');
        _showErr('只能输入1个关键字');
        return;
    }

    if (keyword) {
        $input.val('');
        var themeTag = $('<div class="theme-tag alert alert-success col-xs-3 col-lg-2"></div>')[0];
        var $themeTag = $(themeTag);
        //theme text
        var themeTxt = $('<span class="theme-txt"></span>')[0];
        $(themeTxt).text(keyword);
        $themeTag.append(themeTxt);
        //theme button
        var themeBtn = $('<button type="button" class="close" aria-label="Close" onclick="delThemeTag(this)"><span aria-hidden="true">&times;</span></button>')[0];
        $themeTag.append(themeBtn);
        //append to theme-tags
        $('#theme-tags').append(themeTag);

        theme.push(keyword);
    }
    console.log('theme', theme);
}

function delThemeTag(that) {
    var $btn = $(that);
    var themeTag = $btn.parent();
    var themeText = $btn.siblings('span')[0];
    var indexOfTheme = theme.indexOf($(themeText).text());
    theme.splice(indexOfTheme, 1);
    $(themeTag).remove();
    if (!theme.length) {
        _hideErr();
    }
    console.log('theme', theme);
}

function delAlert(that) {
    var $btn = $(that);
    var parentId = $($btn.parent()).attr('id');
    $('div#' + parentId).hide(500);
}

function _renderLineChart(chart, data) {
    chart.showLoading();

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
            query: {
                maxWidth: 670,
                minWidth: 550
            },
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
            query: {
                maxWidth: 550
            },
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
}