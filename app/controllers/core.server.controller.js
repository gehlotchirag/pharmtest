'use strict';

/**
 * Module dependencies.
 */
var nodemailer = require('nodemailer');
var AWS = require('aws-sdk'),
    crypto = require('crypto'),
    config = require('../../config/aws.json'),
    createS3Policy,
    getExpiryTime;


getExpiryTime = function () {
  var _date = new Date();
  return '' + (_date.getFullYear()) + '-' + (_date.getMonth() + 1) + '-' +
      (_date.getDate() + 1) + 'T' + (_date.getHours() + 3) + ':' + '00:00.000Z';
};

createS3Policy = function(contentType, folder, callback) {
  var date = new Date();
  var s3Policy = {
    'expiration': getExpiryTime(),
    'conditions': [
      ['starts-with', '$key', folder],
      {'bucket': config.bucket},
      {'acl': 'private'},
      ['starts-with', '$Content-Type', contentType],
      {'success_action_status' : '201'}
    ]
  };

  // stringify and encode the policy
  var stringPolicy = JSON.stringify(s3Policy);
  var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

  // sign the base64 encoded policy
  var signature = crypto.createHmac('sha1', config.secretAccessKey)
      .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

  // build the results object
  var s3Credentials = {
    s3Policy: base64Policy,
    s3Signature: signature,
    AWSAccessKeyId: config.accessKeyId,
      signatureVersion: 'v4'
  };

  // send it back
  console.log(s3Credentials);
  callback(s3Credentials);
};

exports.getClientConfig = function (req, res, next) {
  return res.json(200, {
    awsConfig: {
      bucket: config.bucket
    }
  });
};

exports.getS3Policy = function(req, res) {
  console.log(req.query.folder)
  createS3Policy(req.query.mimeType,req.query.folder, function (creds, err) {
    if (!err) {
      return res.status(200).send(creds);
    } else {
      return res.status(500).send(err);
    }
  });
};

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'gehlotchirag777@gmail.com',
    pass: 'Gandhi007.'
  }
});

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

/**
 * Show the current Appointment
 */
exports.sendEmail = function(req, res) {
  var data = req.body;
  var mailOptions = {
    from: 'Pharmeasy Test <gehlotchirag777@gmail.com>',
    to: data.to,
    subject: data.subject,
    text: data.text
  };
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
      res.jsonp(error)
    }else{
      console.log('Message sent: ' + info.response);
      res.jsonp('Message sent: ' + info.response);
    }
  });
};
