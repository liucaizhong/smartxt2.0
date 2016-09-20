var express = require('express');
var router = express.Router();

/* GET explore pages. */
// theme search
router.get('/theme', (req, res, next) => {
  res.render('theme');
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
