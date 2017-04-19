'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var doctors = require('../../app/controllers/doctors.server.controller');

	// Doctors Routes
	app.route('/doctors')
		.get(doctors.list)
		.post(users.requiresLogin, doctors.create);

  app.route('/doctorsvisiting')
      .get(doctors.listVisiting)

  app.route('/doctors/:doctorId')
		.get(doctors.read)
		.put(users.requiresLogin, doctors.hasAuthorization, doctors.update)
		.delete(users.requiresLogin, doctors.hasAuthorization, doctors.delete);

	// Finish by binding the Doctor middleware
	app.param('doctorId', doctors.doctorByID);
};
