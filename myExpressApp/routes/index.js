var express = require('express');
var router = express.Router();
var number = 0;
var os = require("os");
var hostname = os.hostname();

/* GET home page. */
router.get('/', function(req, res, next) {
  number += 1;
  res.render('index', { title: 'BYU Idaho!', count: number, hostname: hostname});
});

module.exports = router;
