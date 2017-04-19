'use strict';

//Setting up route
angular.module('doctors')
    .config(["$ocLazyLoadProvider", function($oc) {
  $oc.config({
    debug: true,
    event: false,
    modules: [{
      name: "angularBootstrapNavTree",
      files: ["/modules/app/controllers/lazyload/abn_tree_directive.js", "/modules/app/styles/lazyload/abn_tree.css"]
    },
      {
        name: "ui.calendar",
        serie: true,	// load files in series
        files: [
          "/modules/app/controllers/lazyload/moment.min.js",
          "/modules/app/controllers/lazyload/fullcalendar.min.js",
          "/modules/app/styles/lazyload/fullcalendar.css",
          "/modules/app/controllers/lazyload/calendar.js"
        ]
      },
      {
        name: "ui.select",
        files: ["/modules/app/controllers/lazyload/select.min.js", "/modules/app/styles/lazyload/select.css"]
      },
      {
        name: "ngTagsInput",
        files: ["/modules/app/controllers/lazyload/ng-tags-input.min.js", "/modules/app/styles/lazyload/ng-tags-input.css"]
      },
      {
        name: "colorpicker.module",
        files: ["/modules/app/controllers/lazyload/bootstrap-colorpicker-module.min.js", "/modules/app/styles/lazyload/colorpicker.css"]
      },
      {
        name: "ui.slider",
        serie: true,
        files: ["/modules/app/controllers/lazyload/bootstrap-slider.min.js", "/modules/app/controllers/lazyload/directives/bootstrap-slider.directive.js", "/modules/app/styles/lazyload/bootstrap-slider.css"]
      },
      {
        name: "textAngular",
        serie: true,
        files: ["/modules/app/controllers/lazyload/textAngular-rangy.min.js",  "/modules/app/controllers/lazyload/textAngular.min.js", "/modules/app/controllers/lazyload/textAngularSetup.js", "/modules/app/styles/lazyload/textAngular.css"]
      },
      {
        name: "flow",
        files: ["/modules/app/controllers/lazyload/ng-flow-standalone.min.js"]
      },
      {
        name: "ngImgCrop",
        files: ["/modules/app/controllers/lazyload/ng-img-crop.js", "/modules/app/styles/lazyload/ng-img-crop.css"]
      },
      {
        name: "ngMask",
        files: ["/modules/app/controllers/lazyload/ngMask.min.js"]
      },
      {
        name: "angular-c3",
        files: ["/modules/app/controllers/lazyload/directives/c3.directive.js"]
      },
      {
        name: "easypiechart",
        files: ["/modules/app/controllers/lazyload/angular.easypiechart.min.js"]
      },
      {
        name: "ngMap",
        files: ["/modules/app/controllers/lazyload/ng-map.min.js"]
      }
    ]
  })
}])
    .config(['$stateProvider',
	function($stateProvider) {
		// Doctors state routing
		$stateProvider.
		state('listDoctors', {
			url: '/doctors',
			templateUrl: 'modules/doctors/views/list-doctors.client.view.html'
		}).
        state('VisitingDoctors', {
          url: '/doctorsvisiting',
          templateUrl: 'modules/doctors/views/visiting-doctors.client.view.html'
        }).
        state('createDoctor', {
			url: '/doctors/create',
			templateUrl: 'modules/doctors/views/create-doctor.client.view.html'
          //resolve: {
          //  deps: ["$ocLazyLoad", function(a) {
          //    return a.load({
          //      name: "DoctorsController",
          //      serie: true,
          //      files: [
          //        'js!https://maps.googleapis.com/maps/api/js?libraries=places',
          //      ]
          //    })
          //  }]
          //}

        }).
		state('viewDoctor', {
			url: '/doctors/:doctorId',
			templateUrl: 'modules/doctors/views/view-doctor.client.view.html',
          resolve: {
            deps: ["$ocLazyLoad", function(a) {
              return a.load("ui.calendar")
                  .then(function() {
                    return a.load({
                      name: "app.ctrls",
                      files: ["/modules/app/controllers/lazyload/controllers/calendarCtrl.js"]
                    })
                  });
            }]
          }
        }).
		state('editDoctor', {
			url: '/doctors/:doctorId/edit',
			templateUrl: 'modules/doctors/views/edit-doctor.client.view.html'
		});
	}
]);
