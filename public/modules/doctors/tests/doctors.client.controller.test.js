'use strict';

(function() {
	// Doctors Controller Spec
	describe('Doctors Controller Tests', function() {
		// Initialize global variables
		var DoctorsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Doctors controller.
			DoctorsController = $controller('DoctorsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Doctor object fetched from XHR', inject(function(Doctors) {
			// Create sample Doctor using the Doctors service
			var sampleDoctor = new Doctors({
				name: 'New Doctor'
			});

			// Create a sample Doctors array that includes the new Doctor
			var sampleDoctors = [sampleDoctor];

			// Set GET response
			$httpBackend.expectGET('doctors').respond(sampleDoctors);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.doctors).toEqualData(sampleDoctors);
		}));

		it('$scope.findOne() should create an array with one Doctor object fetched from XHR using a doctorId URL parameter', inject(function(Doctors) {
			// Define a sample Doctor object
			var sampleDoctor = new Doctors({
				name: 'New Doctor'
			});

			// Set the URL parameter
			$stateParams.doctorId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/doctors\/([0-9a-fA-F]{24})$/).respond(sampleDoctor);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.doctor).toEqualData(sampleDoctor);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Doctors) {
			// Create a sample Doctor object
			var sampleDoctorPostData = new Doctors({
				name: 'New Doctor'
			});

			// Create a sample Doctor response
			var sampleDoctorResponse = new Doctors({
				_id: '525cf20451979dea2c000001',
				name: 'New Doctor'
			});

			// Fixture mock form input values
			scope.name = 'New Doctor';

			// Set POST response
			$httpBackend.expectPOST('doctors', sampleDoctorPostData).respond(sampleDoctorResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Doctor was created
			expect($location.path()).toBe('/doctors/' + sampleDoctorResponse._id);
		}));

		it('$scope.update() should update a valid Doctor', inject(function(Doctors) {
			// Define a sample Doctor put data
			var sampleDoctorPutData = new Doctors({
				_id: '525cf20451979dea2c000001',
				name: 'New Doctor'
			});

			// Mock Doctor in scope
			scope.doctor = sampleDoctorPutData;

			// Set PUT response
			$httpBackend.expectPUT(/doctors\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/doctors/' + sampleDoctorPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid doctorId and remove the Doctor from the scope', inject(function(Doctors) {
			// Create new Doctor object
			var sampleDoctor = new Doctors({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Doctors array and include the Doctor
			scope.doctors = [sampleDoctor];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/doctors\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDoctor);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.doctors.length).toBe(0);
		}));
	});
}());