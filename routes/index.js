
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/gc', function (req, res, next) {
  if (global.gc) {
    global.gc();
    console.log("gc", new Date().toLocaleString());
    res.send('gc OK');
    return;
  }

  res.send('gc NG');
});



module.exports = router;

