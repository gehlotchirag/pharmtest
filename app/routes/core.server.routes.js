'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	app.route('/').get(core.index);

  app.route('/appointment-email')
      .post(core.sendEmail);

  app.route('/api/s3Policy')
      .get(core.getS3Policy);

  app.route('/api/config')
      .get(core.getClientConfig);

};
