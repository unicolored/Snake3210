'use strict';
var Snake3210 = angular.module( 'Snake3210', [ 'ngRoute', 'ngTouch', 'ngMaterial' ] );
console.log( 'Module OK' );
Snake3210.config( function( $routeProvider ) {
    $routeProvider.when( '/', {
        //template: 'yo',
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
    //$( '.submitScore' ).hide().prop( 'disabled', true );
} );
