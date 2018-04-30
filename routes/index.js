var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET sqlite page. */
router.get('/sqlite', function(req, res, next) {
  res.render('sqlite', { title: 'SQLite' });
});

module.exports = router;
