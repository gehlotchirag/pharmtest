'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Doctor = mongoose.model('Doctor'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, doctor;

/**
 * Doctor routes tests
 */
describe('Doctor CRUD tests', function() {
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

		// Save a user to the test db and create new Doctor
		user.save(function() {
			doctor = {
				name: 'Doctor Name'
			};

			done();
		});
	});

	it('should be able to save Doctor instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Doctor
				agent.post('/doctors')
					.send(doctor)
					.expect(200)
					.end(function(doctorSaveErr, doctorSaveRes) {
						// Handle Doctor save error
						if (doctorSaveErr) done(doctorSaveErr);

						// Get a list of Doctors
						agent.get('/doctors')
							.end(function(doctorsGetErr, doctorsGetRes) {
								// Handle Doctor save error
								if (doctorsGetErr) done(doctorsGetErr);

								// Get Doctors list
								var doctors = doctorsGetRes.body;

								// Set assertions
								(doctors[0].user._id).should.equal(userId);
								(doctors[0].name).should.match('Doctor Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Doctor instance if not logged in', function(done) {
		agent.post('/doctors')
			.send(doctor)
			.expect(401)
			.end(function(doctorSaveErr, doctorSaveRes) {
				// Call the assertion callback
				done(doctorSaveErr);
			});
	});

	it('should not be able to save Doctor instance if no name is provided', function(done) {
		// Invalidate name field
		doctor.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Doctor
				agent.post('/doctors')
					.send(doctor)
					.expect(400)
					.end(function(doctorSaveErr, doctorSaveRes) {
						// Set message assertion
						(doctorSaveRes.body.message).should.match('Please fill Doctor name');
						
						// Handle Doctor save error
						done(doctorSaveErr);
					});
			});
	});

	it('should be able to update Doctor instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Doctor
				agent.post('/doctors')
					.send(doctor)
					.expect(200)
					.end(function(doctorSaveErr, doctorSaveRes) {
						// Handle Doctor save error
						if (doctorSaveErr) done(doctorSaveErr);

						// Update Doctor name
						doctor.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Doctor
						agent.put('/doctors/' + doctorSaveRes.body._id)
							.send(doctor)
							.expect(200)
							.end(function(doctorUpdateErr, doctorUpdateRes) {
								// Handle Doctor update error
								if (doctorUpdateErr) done(doctorUpdateErr);

								// Set assertions
								(doctorUpdateRes.body._id).should.equal(doctorSaveRes.body._id);
								(doctorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Doctors if not signed in', function(done) {
		// Create new Doctor model instance
		var doctorObj = new Doctor(doctor);

		// Save the Doctor
		doctorObj.save(function() {
			// Request Doctors
			request(app).get('/doctors')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Doctor if not signed in', function(done) {
		// Create new Doctor model instance
		var doctorObj = new Doctor(doctor);

		// Save the Doctor
		doctorObj.save(function() {
			request(app).get('/doctors/' + doctorObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', doctor.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Doctor instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Doctor
				agent.post('/doctors')
					.send(doctor)
					.expect(200)
					.end(function(doctorSaveErr, doctorSaveRes) {
						// Handle Doctor save error
						if (doctorSaveErr) done(doctorSaveErr);

						// Delete existing Doctor
						agent.delete('/doctors/' + doctorSaveRes.body._id)
							.send(doctor)
							.expect(200)
							.end(function(doctorDeleteErr, doctorDeleteRes) {
								// Handle Doctor error error
								if (doctorDeleteErr) done(doctorDeleteErr);

								// Set assertions
								(doctorDeleteRes.body._id).should.equal(doctorSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Doctor instance if not signed in', function(done) {
		// Set Doctor user 
		doctor.user = user;

		// Create new Doctor model instance
		var doctorObj = new Doctor(doctor);

		// Save the Doctor
		doctorObj.save(function() {
			// Try deleting Doctor
			request(app).delete('/doctors/' + doctorObj._id)
			.expect(401)
			.end(function(doctorDeleteErr, doctorDeleteRes) {
				// Set message assertion
				(doctorDeleteRes.body.message).should.match('User is not logged in');

				// Handle Doctor error error
				done(doctorDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Doctor.remove().exec();
		done();
	});
});