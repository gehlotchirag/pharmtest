
'use strict';

angular.module('core').controller('BodyController', ['$scope', 'Authentication', 'Menus',
  function($scope, Authentication, Menus) {
    $scope.applicationState = "Dashboard";
    $scope.bodyFull = true;
    //$scope.applicationState = "Homepage";
  }]);
