'use strict';

var searchMap = echarts.init(document.getElementById('searchMap'), 'macarons');
var url = '/ou1.json';
var resBuy = [],
    resSell = [],
    resAll = [];
var resIndus = [],
    resProv = [];

$(document).ready(function () {

    $(window).on('resize', function () {
        searchMap.resize();
    });

    //get data
    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        success: function success(data) {
            console.log(data);
            resBuy = data.all[0].codes;
            resSell = data.all[1].codes;
            resAll = resBuy.concat(resSell);
            resIndus = data.industry;
            resProv = data.province;

            //render industry list
            _renderIndusList(resIndus);

            //render map
            _renderMap(searchMap, resProv);

            //render results
            _renderResults(resBuy);
        },
        error: function error(err) {
            console.log(err);
        }
    });
});

function _renderResults(data) {
    var stList = document.getElementById('stock-list');
    var repList = document.getElementById('report-list');
    var res = [],
        num = 0;

    if (stList.childElementCount) {
        $(stList).empty();
    }

    if (repList.childElementCount) {
        $(repList).empty();
    }

    //input parameter is Object:Industry or Province
    if (!Array.isArray(data)) {
        var code = data.code;

        code.forEach(function (code) {
            resAll.forEach(function (cur) {
                if (cur.code[0] === code) {
                    res.push(cur);
                }
            });
        });
    } else {
        res = data;
    }

    res.forEach(function (cur, n) {
        cur.dates.forEach(function (rep, i) {
            //render stock list
            var stP = document.createElement('P');
            var stCont = rep.date[0] + ' ' + cur.name[0] + ' ' + cur.code[0];
            $(stP).text(stCont).attr('data-i', num++).hover(_showRepList, _hideRepList);
            $(stList).append(stP);

            //render report list
            var reP = document.createElement('P');
            var repCont = '';
            rep.affs.forEach(function (aff) {
                repCont += '<b>调研机构/研究人员:</b>' + aff.aff[0] + '/';
                var repAuthor = '';
                var repName = '';
                aff.persons.person.forEach(function (per) {
                    repAuthor += per + ' ';
                });
                if (aff.persons.report) {
                    repName = '<b>相关研报:</b>';
                    aff.persons.report.forEach(function (name) {
                        repName += name.reportDate + ':' + name.reportName + '<br>';
                    });
                }

                repCont += repAuthor + '<br>' + repName;
            });

            $(reP).html(repCont).css({ display: 'none' });
            $(repList).append(reP);
        });
    });
}

function _showRepList(e) {

    var target = e.target;

    $(target).toggleClass('chosnSt');

    var i = $(target).attr('data-i');
    var rep = $("#report-list").children()[i];
    $(rep).toggle();
}

function _hideRepList(e) {
    var target = e.target;

    $(target).toggleClass('chosnSt');

    var i = $(target).attr('data-i');
    var rep = $("#report-list").children()[i];
    $(rep).toggle();
}

function _renderIndusList(indus) {
    var fragment = document.createDocumentFragment();

    indus.forEach(function (cur, index) {
        var tab = document.createElement('SPAN');
        $(tab).text(cur.indus[0]);
        $(tab).attr('data-index', index);
        $(tab).addClass('indus-tab');
        $(fragment).append(tab);
    });

    $('#search-industry').append(fragment);
}

function onChosenIndus(that, event) {
    var title = document.getElementById('object');
    var index = $(event.target).attr('data-index');
    var indusObj = resIndus[index];

    if (indusObj) {
        $(title).text(indusObj.indus[0]);
        _renderResults(indusObj);
    }

    event.stopPropagation();
}

function onChosnPerson(that, event) {
    var target = event.target;
    if (target.tagName === 'SPAN') {
        switch ($(target).attr('data-id')) {
            case '1':
                _renderResults(resBuy);
                break;
            case '2':
                _renderResults(resSell);
                break;
            case '3':
                _renderResults(resAll);
                break;
        }
    }
}

function _renderMap(chart, data) {

    //filter show data
    var max = 0;
    var showData = data.map(function (cur) {
        max += parseInt(cur.count[0]);
        return {
            name: cur.prov[0],
            value: cur.count[0],
            more: { code: cur.code }
        };
    });

    console.log(max);
    // configure echart
    chart.showLoading();

    chart.setOption({
        baseOption: {
            tooltip: {
                trigger: 'item'
            },
            visualMap: {
                min: 0,
                max: max,
                splitNumber: 20,
                color: ['#d94e5d', '#50a3ba', '#eac736'],
                textStyle: {
                    color: '#fff'
                },
                show: false
            },
            series: [{
                name: '报告数',
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
                data: showData
            }]
        },
        media: []
    });

    //bind click
    chart.on('click', function (params) {
        console.log(params);
        var codes = params.data.more;
        _renderResults(codes);
    });

    chart.hideLoading();
}