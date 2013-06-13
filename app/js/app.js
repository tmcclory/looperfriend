'use strict';

angular.module('myApp', ['myApp.filters', 'myApp.services','ui.bootstrap']);
//angular.module('myModule', ['ui.bootstrap']);
//var injector = angular.injector(['ng', 'myModule'])

//angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']);

/*
// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'TrackController'});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
    $routeProvider.otherwise({redirectTo: '/view1'});   
  }]);
*/