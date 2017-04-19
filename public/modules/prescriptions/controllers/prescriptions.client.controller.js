'use strict';

// Prescriptions controller
angular.module('prescriptions').controller('PrescriptionsController', ['$scope','$modal','Doctors','Pharmacies', '$stateParams', '$location', 'Authentication', 'Prescriptions',
	function($scope, $modal, Doctors ,Pharmacies,$stateParams, $location, Authentication, Prescriptions) {
		$scope.authentication = Authentication;
        $scope.userList= [];
 		// Create new Prescription
		$scope.create = function() {
			console.log(this.authentication.user);
			// Create new Prescription object
			var prescription = new Prescriptions ({
				name: this.name,
				dosage: this.dosage,
                sharedWith:this.authentication.user._id
			});

			// Redirect after save
			prescription.$save(function(response) {
				$location.path('prescriptions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Prescription
		$scope.remove = function(prescription) {
			if ( prescription ) { 
				prescription.$remove();

				for (var i in $scope.prescriptions) {
					if ($scope.prescriptions [i] === prescription) {
						$scope.prescriptions.splice(i, 1);
					}
				}
			} else {
				$scope.prescription.$remove(function() {
					$location.path('prescriptions');
				});
			}
		};

		// Update existing Prescription
		$scope.update = function() {
			var prescription = $scope.prescription;
			prescription.$update(function() {
				$location.path('prescriptions/' + prescription._id);
				if ($scope.modalOpen){
					alert("Prescription Shared!")
					$scope.modalClose();
				}
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Prescriptions
		$scope.find = function() {
			$scope.prescriptions = Prescriptions.query();
		};

		// Find existing Prescription
		$scope.findOne = function() {
			$scope.prescription = Prescriptions.get({ 
				prescriptionId: $stateParams.prescriptionId
			});
		};

        $scope.findDocNPharma = function() {
            $scope.doctors = Doctors.query();
            $scope.pharmacies = Pharmacies.query();
        };

        // Share Prescription
        $scope.share = function(prescription) {
            if ( prescription ) {
 				console.log(prescription)
				$scope.modalOpen = true;
                $modal.open({
                    templateUrl: "modules/prescriptions/views/modalContent.html",
                    size: "md",
                    scope: $scope, //passed current scope to the modal
                    controller: "PrescriptionsController",
                    resolve: function() {},
                    windowClass: "default"	// Animation Class put here.
                });

            }
        };

        $scope.modalClose = function() {
            $scope.modalOpen = false;
            $scope.$close();	// this method is associated with $modal scope which is this.
        }
        $scope.amendUser = function(user,toggle) {
            if(toggle){
                $scope.prescription.sharedWith.push(user._id)
			}
			else{
                var index = $scope.prescription.sharedWith.indexOf(user._id);
                $scope.prescription.sharedWith.splice(index, 1);
            }
            console.log($scope.userList);
        };

        $scope.sendInvite = function() {
            $scope.update();
        };

    }
]);
