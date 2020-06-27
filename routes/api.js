var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/test/', function(req, res, next) {
  res.send('nice!');
});

router.get('/trees/:id/', function(req, res, next) {
  res.send({data: 'data'});
});

module.exports = router;
