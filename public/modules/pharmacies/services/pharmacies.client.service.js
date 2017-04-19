'use strict';

//Pharmacies service used to communicate Pharmacies REST endpoints
angular.module('pharmacies').factory('Pharmacies', ['$resource',
	function($resource) {
		return $resource('pharmacies/:pharmacyId', { pharmacyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);