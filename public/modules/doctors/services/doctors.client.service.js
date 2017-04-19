'use strict';

//Doctors service used to communicate Doctors REST endpoints
angular.module('doctors').factory('Doctors', ['$resource',
	function($resource) {
		return $resource('doctors/:doctorId', { doctorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);