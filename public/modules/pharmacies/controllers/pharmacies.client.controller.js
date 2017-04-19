'use strict';

// Pharmacies controller
angular.module('pharmacies').controller('PharmaciesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pharmacies',
	function($scope, $stateParams, $location, Authentication, Pharmacies) {
		$scope.authentication = Authentication;

		// Create new Pharmacy
		$scope.create = function() {
			// Create new Pharmacy object
			var pharmacy = new Pharmacies ({
				name: this.name
			});

			// Redirect after save
			pharmacy.$save(function(response) {
				$location.path('pharmacies/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pharmacy
		$scope.remove = function(pharmacy) {
			if ( pharmacy ) { 
				pharmacy.$remove();

				for (var i in $scope.pharmacies) {
					if ($scope.pharmacies [i] === pharmacy) {
						$scope.pharmacies.splice(i, 1);
					}
				}
			} else {
				$scope.pharmacy.$remove(function() {
					$location.path('pharmacies');
				});
			}
		};

		// Update existing Pharmacy
		$scope.update = function() {
			var pharmacy = $scope.pharmacy;

			pharmacy.$update(function() {
				$location.path('pharmacies/' + pharmacy._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pharmacies
		$scope.find = function() {
			$scope.pharmacies = Pharmacies.query();
		};

		// Find existing Pharmacy
		$scope.findOne = function() {
			$scope.pharmacy = Pharmacies.get({ 
				pharmacyId: $stateParams.pharmacyId
			});
		};
		// amendUser
	}
]);
