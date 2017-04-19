'use strict';

// Setting up route
angular.module('app')
    .config(['$stateProvider',
      function($stateProvider) {
        // Users state routing
        $stateProvider.
            state('app', {
              url: '/app',
              templateUrl: 'modules/app/views/base.html'
            }).
            state('prescription', {
              url: '/prescription',
              templateUrl: 'modules/app/views/tables/tables.html'
            }).
             state('dashboard', {
              url: '/',
              templateUrl: 'modules/app/views/dashboard.html'

            });
      }
    ])
    .run(['Authentication','$rootScope','$location',(function(Authentication,$rootScope,$location) {
      $rootScope.$on( "$locationChangeStart", function(event, next, current) {
        $rootScope.authentication = Authentication;
        if ($rootScope.authentication.user == '')
        {
          if($location.path() !== '/signup')
          {
            $location.path( "/signin" );
            return;
          }
        }
        else if ($rootScope.authentication.user.accountType=="doctor" && $rootScope.authentication.user.completeProfile==false) {
          $location.path( "/doctors/create" );
        }
        else {
        }
      })
    })]);
