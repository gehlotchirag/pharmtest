'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Doctor = mongoose.model('Doctor'),
	_ = require('lodash');


/**
 * List of Doctors
 */
exports.listVisiting = function(req, res) {
  Doctor.find({homeVisit:true}).sort('-created').populate('user', 'displayName').exec(function(err, doctors) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(doctors);
    }
  });
};

/**
 * Create a Doctor
 */
exports.create = function(req, res) {
	var doctor = new Doctor(req.body);
	doctor.user = req.user;

	doctor.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

			res.jsonp(doctor);
		}
	});
};

/**
 * Show the current Doctor
 */
exports.read = function(req, res) {
	res.jsonp(req.doctor);
};

/**
 * Update a Doctor
 */
exports.update = function(req, res) {
	var doctor = req.doctor ;

	doctor = _.extend(doctor , req.body);

	doctor.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(doctor);
		}
	});
};

/**
 * Delete an Doctor
 */
exports.delete = function(req, res) {
	var doctor = req.doctor ;

	doctor.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(doctor);
		}
	});
};

/**
 * List of Doctors
 */
exports.list = function(req, res) { 
	Doctor.find().sort('-created').populate('user', 'displayName').exec(function(err, doctors) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(doctors);
		}
	});
};

/**
 * Doctor middleware
 */
exports.doctorByID = function(req, res, next, id) { 
	Doctor.findById(id).populate('user', 'displayName').exec(function(err, doctor) {
		if (err) return next(err);
		if (! doctor) return next(new Error('Failed to load Doctor ' + id));
		req.doctor = doctor ;
		next();
	});
};

/**
 * Doctor authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.doctor.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
