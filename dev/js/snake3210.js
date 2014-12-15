'use strict';

var Snake3210 = angular.module('Snake3210', ['ngRoute','ngTouch','ngMaterial']);
console.log('Module OK');
Snake3210
.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    //template: 'yo',
    templateUrl: 'js/views/play.html',
    controller: 'PlayCtrl'
  })
  .when('/classement', {
    templateUrl: 'js/views/classement.html',
    controller: 'ClassementCtrl'
  })
  .when('/aide', {
    templateUrl: 'js/views/aide.html',
    controller: 'AideCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });

  //$( '.submitScore' ).hide().prop( 'disabled', true );
});
