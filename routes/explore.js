var express = require('express');
var router = express.Router();
// var http = require('http');
// var url = require('url');
// var urls = ['http://139.196.18.233:8087/axis2/services/smartxtAPI/getHeat?', 
// 			'http://139.196.18.233:8087/axis2/services/smartxtAPI/getStocks?'];

/* GET explore pages. */
// theme search
router.get('/theme', (req, res, next) => {
	//http module invoke java api to get JSON
	//http.get to do....
	
	res.render('theme');
});

//handler for post request
router.post('/theme', (req, res, next) => {
	var concept = req.body.keyword;
	// var firPath = urls[0] + 'concept=' + concept + '&src=*&response=application/json';
	// var json = {};
	// var date = new Date();
	// var dateStr = date.getFullYear().toString() + (date.getMonth()+1).toString() + date.getDate().toString();
	// var secPath = urls[1] + 'concept=' + concept + '&date=' + dateStr + '&src=*&period=10&response=application/json';
	// //http module invoke java api to get JSON
	// //send http request
 //  	http.get(url.parse(firPath), function(response) {
 //  		var body = '';
	//     response.on('data', function(d) {
	//       body += d;
	//     });

	//     response.on('end', function() {
	//     	json.theme = body;
	//     	console.log('1st end!');

	//     	http.get(url.parse(secPath), function(response) {
	// 	  		var body = '';
	// 		    response.on('data', function(d) {
	// 		      body += d;
	// 		    });

	// 		    response.on('end', function() {
	// 		    	json.rel = body;

	// 		    	console.log('2nd end!');

	// 		    	res.render('theme', {
	// 					jsonData: JSON.stringify(json)
	// 				});
	// 		    });
	// 		});
	//     });
	// });

	res.render('theme', {
		concept: concept
	});
});

// focus insights
router.get('/focus', (req, res, next) => {
  res.render('focus');
});

//topic search
router.get('/topic', (req, res, next) => {
  res.render('topic');
});

module.exports = router;
