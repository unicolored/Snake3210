var Snake3210 = angular.module( 'Snake3210', [ 'ngMaterial', 'ngRoute', 'ngSanitize', 'ngAria' ] );
Snake3210.config( function( $routeProvider ) {
    'use strict';
    $routeProvider.when( '/', {
        templateUrl: './views/play.html',
        controller: 'PlayCtrl'
    } ).when( '/classement', {
        templateUrl: './views/classement.html',
        controller: 'ClassementCtrl'
    } ).when( '/aide', {
        templateUrl: './views/aide.html',
        controller: 'AideCtrl'
    } ).otherwise( {
        redirectTo: '/'
    } );
} );
