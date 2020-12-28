const express = require('express');
const router = express.Router();
const sendMailService = require('../domain/mailService');

/* POST send mail. */
router.post('/', function(req, res, next) {
  console.log(req.body);
  //send mail
  sendMailService(req.body);
  res.send('mail sent successfully');
});

module.exports = router;
