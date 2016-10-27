'use strict';

//global parameters
var delStocks = [];
var URL = "/stockList.json";
var stocks = [];
var LISTMAX = 10;
var listTop = 0,
    listLeft = 0,
    listWidth = 0,
    listHeight = 0;
var stockHover = 0;

$(document).ready(function () {
  //ajax get stock list
  $.ajax({
    url: URL,
    type: 'GET',
    async: true,
    dataType: 'json',
    success: function success(data) {
      data.stocklist.forEach(function (cur) {
        stocks.push(cur.code + cur.name);
      });
    },
    error: function error(err) {
      console.log(err);
    }
  });

  //keyup handler
  $('#stockInput').on('input propertychange', function (e) {
    var value = $(this).val();
    if (!value) {
      _hideStockList();
      return;
    }
    var len = value.length;
    var reg = new RegExp(value, 'ig');
    var indicator = 0;
    var stockUl = $('ul[class*="stock-ul"')[0];
    var $stockUl = $(stockUl);
    if ($stockUl.children()) {
      $stockUl.empty();
    }

    stocks.every(function (cur) {
      var i = cur.search(reg);
      if (i != -1) {
        if (i < 6 && i + len <= 6) {
          var item1 = $('<span class="item-1"></span>');
          var str = cur.substring(0, i) + '<strong>' + cur.substr(i, len) + '</strong>';
          str += cur.substring(len + i, 6);
          $(item1).html(str);

          var item2 = $('<span class="item-2"></span>').text(cur.slice(6));
          var div = $('<div></div>').attr('rel', indicator);
          $(div).append(item1).append(item2);

          var li = $('<li></li>').append(div);
          if (!indicator) {
            $(li).addClass('stock-li-hover');
          }
          _addHandlerToLI(li);

          $stockUl.append(li);

          ++indicator;
        }

        if (i >= 6) {
          var item1 = $('<span class="item-1"></span>').text(cur.substring(0, 6));

          var item2 = $('<span class="item-2"></span>');
          var str = cur.substring(6, i) + '<strong>' + cur.substr(i, len) + '</strong>';
          str += cur.slice(len + i);
          $(item2).html(str);

          var div = $('<div></div>').attr('rel', indicator);
          $(div).append(item1).append(item2);

          var li = $('<li></li>').append(div);
          if (!indicator) {
            $(li).addClass('stock-li-hover');
          }
          _addHandlerToLI(li);

          $stockUl.append(li);

          ++indicator;
        }

        if (indicator >= LISTMAX) {
          _showStockList();
          return false;
        }
      }

      return true;
    });

    if (indicator > 0) {
      _showStockList();
    } else {
      $stockUl.append($('<li>未找到符合条件的结果</li>'));
      _showStockList();
    }
  });
  $('#stockInput').focus(function (event) {
    if ($(this).val()) _showStockList();
  });
  $(window).click(function (event) {

    var clientX = event.pageX;
    var clientY = event.pageY;

    // console.log(listTop,listLeft,listWidth,listHeight);

    if ($('#stockInput:focus').length == 0) {
      if (listTop && listLeft && listWidth && listHeight) {
        if (clientX <= listLeft || clientX >= listLeft + listWidth || clientY <= listTop || clientY >= listTop + listHeight) {
          _hideStockList();
        }
      }
    }
  });
  $('#stockInput').keydown(function (e) {

    var keycode = e.keyCode;
    console.log('keycode', keycode);
    var curLI = $('li[class*="stock-li-hover"]')[0];
    var rel = +$(curLI).find('div').attr('rel');
    var len = $('#stockList li').children().length;

    switch (keycode) {
      case 13:
        e.preventDefault();
        $(this).blur();
        _hideStockList();
        _addTableContent(curLI);
        break;
      case 38:
        e.preventDefault();
        if (rel != 0 && rel - 1 >= 0) {
          $('#stockList>ul li:nth-child(' + (rel + 1) + ')').removeClass('stock-li-hover');
          $('#stockList>ul li:nth-child(' + rel + ')').addClass('stock-li-hover');
        }
        break;
      case 40:
        e.preventDefault();
        if (rel != 9 && rel + 1 < len) {
          $('#stockList>ul li:nth-child(' + (rel + 1) + ')').removeClass('stock-li-hover');
          $('#stockList>ul li:nth-child(' + (rel + 2) + ')').addClass('stock-li-hover');
        }
        break;
    }
  });
});

function _showStockList() {
  var stockList = $('#stockList')[0];
  $(stockList).show();
  listTop = stockList.offsetTop;
  listLeft = stockList.offsetLeft;
  listWidth = stockList.offsetWidth;
  listHeight = stockList.offsetHeight;

  console.dir(stockList);
  console.log(listTop, listLeft, listWidth, listHeight);
}

function _hideStockList() {
  $('#stockList').hide();
  listTop = 0;
  listLeft = 0;
  listWidth = 0;
  listHeight = 0;
}

function _addHandlerToLI(li) {
  $(li).click(function (e) {
    _hideStockList();
    _addTableContent(this);
  }).hover(function (e) {
    $(this).siblings('li[class*="stock-li-hover"]').removeClass('stock-li-hover');
    if (!$(this).hasClass('stock-li-hover')) {
      $(this).addClass('stock-li-hover');
    }
    stockHover = $(this).find('div').attr('rel');
    // console.log('stockHover', stockHover);
  }, function (e) {
    var clientX = e.pageX;
    var clientY = e.pageY;

    if (listTop && listLeft && listWidth && listHeight) {
      if (clientX <= listLeft || clientX >= listLeft + listWidth || clientY <= listTop || clientY >= listTop + listHeight) {} else {
        if ($(this).hasClass('stock-li-hover')) {
          $(this).removeClass('stock-li-hover');
        }
      }
    }
  });
}

function onAddStock(that) {
  var stock = $('#stockList').find('li[class*="stock-li-hover"]')[0];

  if (stock) {
    _addTableContent(stock);
  }
}

function _addTableContent(li) {
  var $li = $(li);
  var code = $li.find('span[class*="item-1"]').text();
  var name = $li.find('span[class*="item-2"]').text();

  //ajax post

  var tableContent = $('<div class="row table-content">\n                              <div class="col-xs-8 col-lg-8" onclick="onCheck(event)">\n                                    <input type="checkbox">\n                                    <span class="stock-code"></span>\n                                    <span class="stock-name"></span>\n                              </div>\n                              <div class="col-xs-4 col-lg-4 span-fork">\n                                    <i class="fa fa-times" aria-hidden="true" onclick="onDel(this)"></i>\n                              </div>\n                          </div>');

  $(tableContent).find('span[class*="stock-code"]').text(code);
  $(tableContent).find('span[class*="stock-name"]').text(name);

  $('#tableContent').append(tableContent);
}

function onDelAllStock(that) {
  var tableContent = $('#tableContent input:checked');
  var delNum = tableContent.length;

  if (delNum) {
    delStocks = tableContent;
    $('#alertTitle').text('删除股票');
    $('#alertText').text('确定删除这些股票？');
    $('#global-alert').show();
  }
}

function onCheckAll(event) {
  event.stopPropagation();
  if (event.target.tagName == 'INPUT') {
    var check = document.getElementById('checkAll');
    if (check.checked) {
      var checkbox = document.querySelectorAll('div.table-content input');
      if (checkbox.length) {
        Array.prototype.forEach.call(checkbox, function (cur) {
          if (!cur.checked) cur.checked = true;
        });
        //calculate the number of checked item
        var stockAll = $('div.table-content').length;
        var stockChecked = $('div#tableContent input:checked').length;
        $('#stockChecked').text(stockChecked);
        $('#stockAll').text(stockAll);

        $('#del-all').show(500);
      } else {
        check.checked = false;
      }
    } else {
      var checkbox = document.querySelectorAll('div.table-content input');
      Array.prototype.forEach.call(checkbox, function (cur) {
        if (cur.checked) cur.checked = false;
      });
      $('#del-all').hide(500);
    }
  }
}

function onCheck(event) {
  event.stopPropagation();
  if (event.target.tagName == 'INPUT') {
    var checkAll = document.getElementById('checkAll');
    var stockAll = $('div.table-content').length;
    var stockChecked = $('div#tableContent input:checked').length;
    if (stockChecked) {
      if (!checkAll.checked) {
        checkAll.checked = true;
        $('#stockChecked').text(stockChecked);
        $('#stockAll').text(stockAll);
        $('#del-all').show(500);
      } else {
        $('#stockChecked').text(stockChecked);
        $('#stockAll').text(stockAll);
      }
    } else {
      checkAll.checked = false;
      $('#del-all').hide(500);
    }
  }
}

function onDel(that) {
  delStocks = $(that);

  var stockName = $(that).parent().parent().find('span[class*="stock-name"]').text();

  $('#alertTitle').text('删除股票');
  $('#alertText').text('确定删除股票：' + stockName + '？');
  $('#global-alert').show();
}

function onConfirm() {
  var checkAll = document.getElementById('checkAll');

  $('#global-alert').hide();
  $('#del-all').hide(500);
  checkAll.checked = false;
  //delete the checked stocks
  $(delStocks).parent().parent().remove();

  //ajax post request

  delStocks = [];
}

function onCancel() {
  $('#global-alert').hide();

  delStocks = [];
}