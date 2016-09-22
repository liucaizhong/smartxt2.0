'use strict';

$(document).ready(function () {

    var searchMap = echarts.init(document.getElementById('searchMap'), 'macarons');
    var url;

    $(window).on('resize', function () {
        searchMap.resize();
    });

    //get data
    $.ajax({
        url: url,
        success: function success(data) {},
        error: function error(err) {}
    });
});

function _renderResults(id, data) {
    var parent = document.getElementById(id);

    if (parent.childElementCount) {
        $(parent).empty();
    }

    data.map(function (cur, index, arr) {
        var div = document.createElement('DIV');
        //$(div).addClass
        var span = document.createElement('SPAN');
        $(span).text('first result').hover(_showDialog(event, obj), _hideDialog(event));
        div.appendChild(span);
    });
}

function _showDialog(e, obj) {
    var text = $(e).text();
    var x = 10;
    var y = 10;

    var div = document.createElement('DIV#dialog');
    var child = document.createElement('P');
    // $(child).html();
    div.appendChild(child);
    //$(div).addClass

    $("body").append(div);

    $("#dialog").css({
        "top": e.pageY + y + "px",
        "left": e.pageX + x + "px"
    }).show(1000);

    $(this).mousemove(function (e) {
        $("#dialog").css({
            "top": e.pageY + y + "px",
            "left": e.pageX + x + "px"
        }).show(1000);
    });
}

function _hideDialog(event) {
    $("#dialog").remove();
}

function _renderThemeList(data) {
    var tab = document.createElement('SPAN');
}

function _renderMap(chart, data) {

    // configure echart
    chart.showLoading();

    chart.setOption({
        baseOption: {
            tooltip: {
                trigger: 'item'
            },
            visualMap: {
                min: 0,
                max: 300,
                splitNumber: 5,
                color: ['#d94e5d', '#50a3ba', '#eac736'],
                textStyle: {
                    color: '#fff'
                },
                show: false
            },
            series: [{
                type: 'map',
                map: 'china',
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    emphasis: {
                        areaColor: '#d94e5d'
                    }
                },
                data: data
            }]
        },
        media: []
    });

    chart.hideLoading();
}