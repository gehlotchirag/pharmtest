'use strict';

module.exports = {
  app: {
    title: 'PharmEasy',
    description: 'Pharmeasy Test',
    keywords: 'Pharmeasy Report Sharing'
  },
  port: process.env.PORT || 8000,
  templateEngine: 'swig',
  sessionSecret: 'MEAN',
  sessionCollection: 'sessions',
  assets: {
    lib: {
      css: [
        'public/modules/app/styles/vendors/angular-material.min.css',
        'public/modules/app/styles/vendors/bootstrap.min.css',
        'public/modules/app/_tmp/main.min.css'
      ],
      js: [
        'public/lib/jquery/dist/jquery.js',
        'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.js',
        'public/lib/ng-file-upload/ng-file-upload-shim.min.js',
        'public/lib/ng-file-upload/ng-file-upload.min.js',
        //'public/lib/angular/angular.js',
        //'public/lib/vendors/angular.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular-animate.js',
        'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular-resource.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular-cookies.min.js',
        //'public/lib/angular-resource/angular-resource.js',
        //'public/lib/angular-cookies/angular-cookies.js',
        //'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-touch/angular-touch.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/modules/app/controllers/plugins/angular-route.min.js',
        'public/modules/app/controllers/plugins/angular-aria.min.js',
        'public/modules/app/controllers/plugins/ui-bootstrap-tpls.min.js',
        'public/modules/app/controllers/plugins/angular-material.min.js',
        'public/modules/app/controllers/plugins/ocLazyLoad.min.js',
        'public/modules/app/controllers/plugins/loading-bar.min.js',
        'public/modules/app/controllers/plugins/angular-fullscreen.js',
        'public/modules/app/controllers/plugins/perfect-scrollbar.min.js',
        'public/modules/app/controllers/shared/app.ctrls.js',
        'public/modules/app/controllers/shared/app.directives.js',
        'public/modules/app/controllers/ui/app.ui.ctrls.js',
        'public/modules/app/controllers/ui/app.ui.directives.js',
        'public/modules/app/controllers/forms/app.form.ctrls.js',
        'public/modules/app/controllers/tables/app.table.ctrls.js',
        'public/modules/app/controllers/email/app.email.ctrls.js',
        'public/modules/app/controllers/todo/app.todo.js',
        'public/modules/app/controllers/lazyload/calendar.js',
        //'public/modules/app/controllers/todo/app.todo.js',
        //'public/modules/app/controllers/models/js/three.js',
        //'public/modules/app/controllers/models/js/UCSCharacter.js',
        //'public/modules/app/controllers/models/js/data.gui.js',
        //'public/modules/app/controllers/models/js/orbit.js',
        'public/lib/angular-google-places-autocomplete/src/autocomplete.js',
        'public/modules/app/SimpleWebRTC/socket.io.js',
          'public/lib/xml2json/xml2json.js',
          'public/lib/ngmap/build/scripts/ng-map.min.js'
      ]
    },
    //css: [
    //	'public/modules/**/css/*.css'
    //],
    js: [
      'public/config.js',
      'public/application.js',
      'public/modules/*/*.js',
      'public/modules/*/*[!tests]*/*.js'
    ],
    tests: [
      //'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular-mocks.js',
      'public/lib/angular-mocks/angular-mocks.js',
      'public/modules/*/tests/*.js'
    ]
  }
};
