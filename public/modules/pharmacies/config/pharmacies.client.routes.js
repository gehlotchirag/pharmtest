'use strict';

//Setting up route
angular.module('pharmacies').config(['$stateProvider',
	function($stateProvider) {
		// Pharmacies state routing
		$stateProvider.
		state('listPharmacies', {
			url: '/pharmacies',
			templateUrl: 'modules/pharmacies/views/list-pharmacies.client.view.html'
		}).
		state('createPharmacy', {
			url: '/pharmacies/create',
			templateUrl: 'modules/pharmacies/views/create-pharmacy.client.view.html'
		}).
		state('viewPharmacy', {
			url: '/pharmacies/:pharmacyId',
			templateUrl: 'modules/pharmacies/views/view-pharmacy.client.view.html'
		}).
		state('editPharmacy', {
			url: '/pharmacies/:pharmacyId/edit',
			templateUrl: 'modules/pharmacies/views/edit-pharmacy.client.view.html'
		});
	}
]);