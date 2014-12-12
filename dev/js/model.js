var uiScoreForm = $('.entername');
var uiScore = $('.entername');
var uiDistance = $('.entername');
var uiDistanceLabel = $('.distancelabel');
var uiSubmitScore = $('.submitScore');
var uiAlertsZone = $('.alerts');

function onStart() {
  $( '.entername .leaderboard-score' ).show();
  $( '.entername .leaderboard-distance' ).show();
  $( '.entername .distancelabel' ).show();
  jQuery( '.entername .submitScore' ).prop( 'disabled', true );
  $( '.alerts' ).html( '' );
}
