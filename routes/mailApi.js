const express = require('express');
const router = express.Router();
const mailClient = require('../clients/mailclient');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST send mail. */
router.post('/', function(req, res, next) {
  console.log(req.body);
  //validate request
  //send mail
  mailClient(req.body);
  res.send('mail sent succsefully');
});

module.exports = router;
