const express = require('express');
const router = express.Router();
const auth = require('./auth');

router.use(express.static(__dirname + '/public'));

router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

router.get('/', function(req, res) {
  res.send('/public/index.html');
});

router.get('/purdue_signin',  auth.purdue.bounce, function (req, res) {
  res.send('/public/index.html');
});

module.exports = router;
