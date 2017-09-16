'use strict';

var myApp = angular.module('myApp', ['app.services','app.controllers','ngRoute']);

/*路由*/
myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/in_theaters/:page?', {
        controller: 'in_theaters_c',
        templateUrl: 'template'
    }).when('/coming_soon/:page?', {
        controller: 'coming_soon_c',
        templateUrl: 'template'
    }).when('/top250/:page?', {
        controller: 'top250_c',
        templateUrl: 'template'
    }).when('/search/:text?/:page?', {
        controller: 'search',
        templateUrl: 'template'
    }).otherwise({redirectTo: '/in_theaters'});
}]);