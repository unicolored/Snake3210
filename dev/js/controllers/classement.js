/**
 * @ngdoc function
 * @name Snake3210.controller:ClassementCtrl
 * @description
 * # ClassementCtrl
 * Controller of the Snake3210
 */
Snake3210.controller( 'ClassementCtrl', [ '$rootScope', '$scope', function( $rootScope, $scope ) {
    'use strict';
    /*
    ##         ## ##      ##       ########    ###    ########  ######## ########  ########   #######     ###    ########  ########
    ##         ## ##      ##       ##         ## ##   ##     ## ##       ##     ## ##     ## ##     ##   ## ##   ##     ## ##     ##
    ##       #########    ##       ##        ##   ##  ##     ## ##       ##     ## ##     ## ##     ##  ##   ##  ##     ## ##     ##
    ##         ## ##      ##       ######   ##     ## ##     ## ######   ########  ########  ##     ## ##     ## ########  ##     ##
    ##       #########    ##       ##       ######### ##     ## ##       ##   ##   ##     ## ##     ## ######### ##   ##   ##     ##
    ##         ## ##      ##       ##       ##     ## ##     ## ##       ##    ##  ##     ## ##     ## ##     ## ##    ##  ##     ##
    ########   ## ##      ######## ######## ##     ## ########  ######## ##     ## ########   #######  ##     ## ##     ## ########
    */
    var LEADERBOARD_SIZE = 20;
    // Create our Firebase reference
    var scoreListRef = new Firebase( 'https://snakeleader.firebaseio.com//scoreList' );
    /*
  var onComplete = function(error) {
  if (error) {
  console.log('Synchronization failed',error);
} else {
console.log('Synchronization succeeded');
}
};
var userScoreRef = scoreListRef.push();
userScoreRef.set({ distance: 'Fred', last: 'Flintstone' }, onComplete);
*/
    // Keep a mapping of firebase locations to HTML elements, so we can move / remove elements as necessary.
    var htmlForPath = {};
    // Create a view to only receive callbacks for the last LEADERBOARD_SIZE scores
    var scoreListView = scoreListRef.limitToFirst( LEADERBOARD_SIZE );
    // Add a callback to handle when a new score is added.
    scoreListView.on( 'child_added', function( newScoreSnapshot, prevScoreName ) {
        handleScoreAdded( newScoreSnapshot, prevScoreName );
    } );
    // Add a callback to handle when a score is removed
    scoreListView.on( 'child_removed', function( oldScoreSnapshot ) {
        handleScoreRemoved( oldScoreSnapshot );
    } );
    // Add a callback to handle when a score changes or moves positions.
    var changedCallback = function( scoreSnapshot, prevScoreName ) {
        handleScoreRemoved( scoreSnapshot );
        handleScoreAdded( scoreSnapshot, prevScoreName );
    };
    scoreListView.on( 'child_moved', changedCallback );
    scoreListView.on( 'child_changed', changedCallback );
    angular.element( ".btn-success" ).on( 'click', function() {
        updatetheScore();
    } );
    // Helper function that takes a new score snapshot and adds an appropriate row to our leaderboard table.
    function handleScoreAdded( scoreSnapshot, prevScoreName ) {
            $rootScope.loading = true;
            var vitesseMoyenne = scoreSnapshot.val().distance / scoreSnapshot.val().timer;
            vitesseMoyenne = Math.round( vitesseMoyenne * 100 ) / 10;
            var newScoreRow = angular.element( "<md-item-content/>" );
            //newScoreRow.append( angular.element( '<div class="md-tile-left"/>' ).append( angular.element( "<em/>" ).html( '<h5>' + scoreSnapshot.val().score + '</h5>' ) ) );
            var dataScore = scoreSnapshot.val().score;
            var dataDistance = scoreSnapshot.val().distance;
            var dataLigne = angular.element( '<h2 />' ).html( '<em>' + dataScore + '</em> ' ).append( $( '<small/>' ).text( scoreSnapshot.val().name ) );
            var dataMeta = angular.element( '<h5 style="text-align:right; padding:0 1em;" />' ).html( dataDistance + " m | Vitesse moy. : " + vitesseMoyenne + " px/s" );
            newScoreRow.append( $( '<div class="md-tile-right" flex layout="row" layout-align="center end" />' ).append( angular.element( '<div flex />' ).html( dataMeta ) ).append( angular.element( '<div flex />' ).html( dataLigne ) ) );
            var dataItem = angular.element( '<md-item />' ).append( newScoreRow );
            angular.element( '<div class="md-padding" flex />' ).append( dataItem );
            // Store a reference to the table row so we can get it again later.
            htmlForPath[ scoreSnapshot.key() ] = newScoreRow;
            // Insert the new score in the appropriate place in the table.
            if ( prevScoreName === null ) {
                angular.element( "#leaderboardTable" ).append( newScoreRow );
            } else {
                var lowerScoreRow = htmlForPath[ prevScoreName ];
                lowerScoreRow.before( newScoreRow );
            }
            $rootScope.loading = false;
        }
        // Helper function to handle a score object being removed; just removes the corresponding table row.
    function handleScoreRemoved( scoreSnapshot ) {
        var removedScoreRow = htmlForPath[ scoreSnapshot.key() ];
        removedScoreRow.remove();
        delete htmlForPath[ scoreSnapshot.key() ];
    }
} ] );
