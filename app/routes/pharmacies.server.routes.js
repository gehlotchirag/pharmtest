'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var pharmacies = require('../../app/controllers/pharmacies.server.controller');

	// Pharmacies Routes
	app.route('/pharmacies')
		.get(pharmacies.list)
		.post(users.requiresLogin, pharmacies.create);

	app.route('/pharmacies/:pharmacyId')
		.get(pharmacies.read)
		.put(users.requiresLogin, pharmacies.hasAuthorization, pharmacies.update)
		.delete(users.requiresLogin, pharmacies.hasAuthorization, pharmacies.delete);

	// Finish by binding the Pharmacy middleware
	app.param('pharmacyId', pharmacies.pharmacyByID);
};
