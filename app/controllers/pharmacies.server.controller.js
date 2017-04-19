'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Pharmacy = mongoose.model('Pharmacy'),
	_ = require('lodash');

/**
 * Create a Pharmacy
 */
exports.create = function(req, res) {
	var pharmacy = new Pharmacy(req.body);
	pharmacy.user = req.user;

	pharmacy.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pharmacy);
		}
	});
};

/**
 * Show the current Pharmacy
 */
exports.read = function(req, res) {
	res.jsonp(req.pharmacy);
};

/**
 * Update a Pharmacy
 */
exports.update = function(req, res) {
	var pharmacy = req.pharmacy ;

	pharmacy = _.extend(pharmacy , req.body);

	pharmacy.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pharmacy);
		}
	});
};

/**
 * Delete an Pharmacy
 */
exports.delete = function(req, res) {
	var pharmacy = req.pharmacy ;

	pharmacy.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pharmacy);
		}
	});
};

/**
 * List of Pharmacies
 */
exports.list = function(req, res) { 
	Pharmacy.find().sort('-created').populate('user', 'displayName').exec(function(err, pharmacies) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pharmacies);
		}
	});
};

/**
 * Pharmacy middleware
 */
exports.pharmacyByID = function(req, res, next, id) { 
	Pharmacy.findById(id).populate('user', 'displayName').exec(function(err, pharmacy) {
		if (err) return next(err);
		if (! pharmacy) return next(new Error('Failed to load Pharmacy ' + id));
		req.pharmacy = pharmacy ;
		next();
	});
};

/**
 * Pharmacy authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.pharmacy.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
