'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Pharmacy = mongoose.model('Pharmacy'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, pharmacy;

/**
 * Pharmacy routes tests
 */
describe('Pharmacy CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Pharmacy
		user.save(function() {
			pharmacy = {
				name: 'Pharmacy Name'
			};

			done();
		});
	});

	it('should be able to save Pharmacy instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pharmacy
				agent.post('/pharmacies')
					.send(pharmacy)
					.expect(200)
					.end(function(pharmacySaveErr, pharmacySaveRes) {
						// Handle Pharmacy save error
						if (pharmacySaveErr) done(pharmacySaveErr);

						// Get a list of Pharmacies
						agent.get('/pharmacies')
							.end(function(pharmaciesGetErr, pharmaciesGetRes) {
								// Handle Pharmacy save error
								if (pharmaciesGetErr) done(pharmaciesGetErr);

								// Get Pharmacies list
								var pharmacies = pharmaciesGetRes.body;

								// Set assertions
								(pharmacies[0].user._id).should.equal(userId);
								(pharmacies[0].name).should.match('Pharmacy Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Pharmacy instance if not logged in', function(done) {
		agent.post('/pharmacies')
			.send(pharmacy)
			.expect(401)
			.end(function(pharmacySaveErr, pharmacySaveRes) {
				// Call the assertion callback
				done(pharmacySaveErr);
			});
	});

	it('should not be able to save Pharmacy instance if no name is provided', function(done) {
		// Invalidate name field
		pharmacy.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pharmacy
				agent.post('/pharmacies')
					.send(pharmacy)
					.expect(400)
					.end(function(pharmacySaveErr, pharmacySaveRes) {
						// Set message assertion
						(pharmacySaveRes.body.message).should.match('Please fill Pharmacy name');
						
						// Handle Pharmacy save error
						done(pharmacySaveErr);
					});
			});
	});

	it('should be able to update Pharmacy instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pharmacy
				agent.post('/pharmacies')
					.send(pharmacy)
					.expect(200)
					.end(function(pharmacySaveErr, pharmacySaveRes) {
						// Handle Pharmacy save error
						if (pharmacySaveErr) done(pharmacySaveErr);

						// Update Pharmacy name
						pharmacy.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Pharmacy
						agent.put('/pharmacies/' + pharmacySaveRes.body._id)
							.send(pharmacy)
							.expect(200)
							.end(function(pharmacyUpdateErr, pharmacyUpdateRes) {
								// Handle Pharmacy update error
								if (pharmacyUpdateErr) done(pharmacyUpdateErr);

								// Set assertions
								(pharmacyUpdateRes.body._id).should.equal(pharmacySaveRes.body._id);
								(pharmacyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Pharmacies if not signed in', function(done) {
		// Create new Pharmacy model instance
		var pharmacyObj = new Pharmacy(pharmacy);

		// Save the Pharmacy
		pharmacyObj.save(function() {
			// Request Pharmacies
			request(app).get('/pharmacies')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Pharmacy if not signed in', function(done) {
		// Create new Pharmacy model instance
		var pharmacyObj = new Pharmacy(pharmacy);

		// Save the Pharmacy
		pharmacyObj.save(function() {
			request(app).get('/pharmacies/' + pharmacyObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', pharmacy.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Pharmacy instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pharmacy
				agent.post('/pharmacies')
					.send(pharmacy)
					.expect(200)
					.end(function(pharmacySaveErr, pharmacySaveRes) {
						// Handle Pharmacy save error
						if (pharmacySaveErr) done(pharmacySaveErr);

						// Delete existing Pharmacy
						agent.delete('/pharmacies/' + pharmacySaveRes.body._id)
							.send(pharmacy)
							.expect(200)
							.end(function(pharmacyDeleteErr, pharmacyDeleteRes) {
								// Handle Pharmacy error error
								if (pharmacyDeleteErr) done(pharmacyDeleteErr);

								// Set assertions
								(pharmacyDeleteRes.body._id).should.equal(pharmacySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Pharmacy instance if not signed in', function(done) {
		// Set Pharmacy user 
		pharmacy.user = user;

		// Create new Pharmacy model instance
		var pharmacyObj = new Pharmacy(pharmacy);

		// Save the Pharmacy
		pharmacyObj.save(function() {
			// Try deleting Pharmacy
			request(app).delete('/pharmacies/' + pharmacyObj._id)
			.expect(401)
			.end(function(pharmacyDeleteErr, pharmacyDeleteRes) {
				// Set message assertion
				(pharmacyDeleteRes.body.message).should.match('User is not logged in');

				// Handle Pharmacy error error
				done(pharmacyDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Pharmacy.remove().exec();
		done();
	});
});