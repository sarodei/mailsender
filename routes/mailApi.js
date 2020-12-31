const express = require('express');
const sendMailService = require('../domain/mailService');
const logger = require('../config/logger')('mailApi.js');

const router = express.Router();

/* POST send mail. */
router.post('/', async function(req, res, next) {
  try{
  let requestId = req.headers['X-API-Request'];
  logger.info("Request recieved for sending mail for requestId:" + requestId, req.body, req.headers);

  //send mail
  let result = await sendMailService(req.body, requestId);
  logger.info("Response generated for sending mail for requestId:" + requestId, result);

  res.send(result);
  }catch(err){
    logger.error("Error processing request for requestId:" + requestId, err);
    next(err);
  }
});

module.exports = router;
