const express = require('express');
const router = express.Router();

router.use(express.static(__dirname + '/public'));

router.get('/', function(req, res) {
  console.log(req);
  res.send('/public/index.html');
});

module.exports = router
