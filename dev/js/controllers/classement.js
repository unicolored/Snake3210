'use strict';

/**
* @ngdoc function
* @name yoangularApp.controller:AboutCtrl
* @description
* # AboutCtrl
* Controller of the yoangularApp
*/
Snake3210
.controller('ClassementCtrl', ['$scope', function ($scope) {

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
var scoreListView = scoreListRef.limit( LEADERBOARD_SIZE );
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
$( ".entername .btn-success" ).on( 'click', function() {
  updatetheScore();
} );
// Helper function that takes a new score snapshot and adds an appropriate row to our leaderboard table.
function handleScoreAdded( scoreSnapshot, prevScoreName ) {
  var vitesseMoyenne = scoreSnapshot.val().distance / scoreSnapshot.val().timer;
  vitesseMoyenne = Math.round( vitesseMoyenne * 100 ) / 10;

  var newScoreRow = $("<md-item-content/>");
  //newScoreRow.append( $( '<div class="md-tile-left"/>' ).append( $( "<em/>" ).html( '<h5>' + scoreSnapshot.val().score + '</h5>' ) ) );
  newScoreRow.append( $( '<div class="md-tile-right"/>' ).append( $( "<em/>" ).html( '<h1>' + scoreSnapshot.val().score + '</h1>' )).append( $('<h3/>').text(scoreSnapshot.val().name) ).append( scoreSnapshot.val().distance + " m | Vitesse moy. : " + vitesseMoyenne + " px/s" ) );
  newScoreRow.append('<md-divider></md-divider>');
  $( "<md-item/>" ).append( newScoreRow );
  // Store a reference to the table row so we can get it again later.
  htmlForPath[ scoreSnapshot.name() ] = newScoreRow;
  // Insert the new score in the appropriate place in the table.
  if ( prevScoreName === null ) {
    $( "#leaderboardTable" ).append( newScoreRow );
  } else {
    var lowerScoreRow = htmlForPath[ prevScoreName ];
    lowerScoreRow.before( newScoreRow );
  }
}
// Helper function to handle a score object being removed; just removes the corresponding table row.
function handleScoreRemoved( scoreSnapshot ) {
  var removedScoreRow = htmlForPath[ scoreSnapshot.name() ];
  removedScoreRow.remove();
  delete htmlForPath[ scoreSnapshot.name() ];
}

}]);
