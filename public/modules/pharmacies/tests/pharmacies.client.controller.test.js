'use strict';

(function() {
	// Pharmacies Controller Spec
	describe('Pharmacies Controller Tests', function() {
		// Initialize global variables
		var PharmaciesController,
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

			// Initialize the Pharmacies controller.
			PharmaciesController = $controller('PharmaciesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Pharmacy object fetched from XHR', inject(function(Pharmacies) {
			// Create sample Pharmacy using the Pharmacies service
			var samplePharmacy = new Pharmacies({
				name: 'New Pharmacy'
			});

			// Create a sample Pharmacies array that includes the new Pharmacy
			var samplePharmacies = [samplePharmacy];

			// Set GET response
			$httpBackend.expectGET('pharmacies').respond(samplePharmacies);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pharmacies).toEqualData(samplePharmacies);
		}));

		it('$scope.findOne() should create an array with one Pharmacy object fetched from XHR using a pharmacyId URL parameter', inject(function(Pharmacies) {
			// Define a sample Pharmacy object
			var samplePharmacy = new Pharmacies({
				name: 'New Pharmacy'
			});

			// Set the URL parameter
			$stateParams.pharmacyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/pharmacies\/([0-9a-fA-F]{24})$/).respond(samplePharmacy);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pharmacy).toEqualData(samplePharmacy);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Pharmacies) {
			// Create a sample Pharmacy object
			var samplePharmacyPostData = new Pharmacies({
				name: 'New Pharmacy'
			});

			// Create a sample Pharmacy response
			var samplePharmacyResponse = new Pharmacies({
				_id: '525cf20451979dea2c000001',
				name: 'New Pharmacy'
			});

			// Fixture mock form input values
			scope.name = 'New Pharmacy';

			// Set POST response
			$httpBackend.expectPOST('pharmacies', samplePharmacyPostData).respond(samplePharmacyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Pharmacy was created
			expect($location.path()).toBe('/pharmacies/' + samplePharmacyResponse._id);
		}));

		it('$scope.update() should update a valid Pharmacy', inject(function(Pharmacies) {
			// Define a sample Pharmacy put data
			var samplePharmacyPutData = new Pharmacies({
				_id: '525cf20451979dea2c000001',
				name: 'New Pharmacy'
			});

			// Mock Pharmacy in scope
			scope.pharmacy = samplePharmacyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/pharmacies\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/pharmacies/' + samplePharmacyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid pharmacyId and remove the Pharmacy from the scope', inject(function(Pharmacies) {
			// Create new Pharmacy object
			var samplePharmacy = new Pharmacies({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Pharmacies array and include the Pharmacy
			scope.pharmacies = [samplePharmacy];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/pharmacies\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePharmacy);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.pharmacies.length).toBe(0);
		}));
	});
}());