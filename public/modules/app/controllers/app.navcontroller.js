/**
 * Created by chirag on 11/08/15.
 */
angular.module('doctors').controller('navController', ['$scope', '$stateParams', '$location', 'Authentication',
  function($scope, $stateParams, $location, Authentication) {
    $scope.authentication = Authentication;

  }]);

