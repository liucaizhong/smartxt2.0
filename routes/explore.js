var express = require('express');
var router = express.Router();
var http = require('http');

/* GET explore pages. */
// theme search
router.get('/theme', (req, res, next) => {
	//http module invoke java api to get JSON
	//http.get to do....
	
	res.render('theme');
});

//handler for post request
router.post('/theme', (req, res, next) => {
	var data = req.body;

	//set default condition
	if(!data) {
		// data = ;
	}

	//http module invoke java api to get JSON
	//http.get to do....
	var jsonData = data;
	console.log(jsonData);
	
	if(jsonData) {
		res.render('theme', {
			reqCond: JSON.stringify(data),
			jsonData: JSON.stringify(jsonData)
		});
	}else {
		res.render('theme');
	}
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
