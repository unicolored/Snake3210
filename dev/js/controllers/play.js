/**
 * @ngdoc function
 * @name yoangularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the yoangularApp
 */
Snake3210.controller( 'PlayCtrl', [ '$scope', function( $scope ) {
    'use strict';
    var snakecanvas = document.getElementById( "the-game" );
    var snakecontext = snakecanvas.getContext( "2d" );
    $( '.entername .submitScore' ).prop( 'disabled', true );
    var snakegame = {
        score: 0,
        fps: 8,
        over: false,
        message: null,
        distance: 1,
        timer: 0,
        /*
        ##         ## ##       ######  ########    ###    ########  ########     ######  ########  #######  ########
        ##         ## ##      ##    ##    ##      ## ##   ##     ##    ##       ##    ##    ##    ##     ## ##     ##
        ##       #########    ##          ##     ##   ##  ##     ##    ##       ##          ##    ##     ## ##     ##
        ##         ## ##       ######     ##    ##     ## ########     ##        ######     ##    ##     ## ########
        ##       #########          ##    ##    ######### ##   ##      ##             ##    ##    ##     ## ##
        ##         ## ##      ##    ##    ##    ##     ## ##    ##     ##       ##    ##    ##    ##     ## ##
        ########   ## ##       ######     ##    ##     ## ##     ##    ##        ######     ##     #######  ##
        */
        start: function() {
            snakegame.over = false;
            snakegame.message = null;
            snakegame.score = 0;
            snakegame.fps = 8;
            snakeserpent.init();
            snakefood.set();
            snakegame.distance = 1;
            snakegame.timer = 0;
            $( '.entername .leaderboard-score' ).show();
            $( '.entername .leaderboard-distance' ).show();
            $( '.entername .distancelabel' ).show();
            $( '.entername .submitScore' ).prop( 'disabled', true );
            $( '.alerts' ).html( '' );
        },
        stop: function() {
            snakegame.over = true;
            snakegame.message = 'START';
            $( '.entername .submitScore' ).prop( 'disabled', false );
            $( '.soumettre' ).show();
            var globalRef = new Firebase( 'https://snakeleader.firebaseio.com/snakeGlobal/distanceTotale' );
            globalRef.transaction( function( current ) {
                // If /users/fred/rank has never been set, currentRank will be null.
                //console.log( snakegame.distance );
                return current + ( Math.round( snakegame.distance * 0.02 * snakegame.fps ) );
            } );
        },
        drawBox: function( x, y, size, color ) {
            snakecontext.fillStyle = color;
            snakecontext.beginPath();
            snakecontext.moveTo( x - ( size / 2 ), y - ( size / 2 ) );
            snakecontext.lineTo( x + ( size / 2 ), y - ( size / 2 ) );
            snakecontext.lineTo( x + ( size / 2 ), y + ( size / 2 ) );
            snakecontext.lineTo( x - ( size / 2 ), y + ( size / 2 ) );
            snakecontext.closePath();
            snakecontext.fill();
        },
        drawScore: function() {
            //snakecontext.fillStyle = '#172516';
            //snakecontext.font = ( snakecanvas.height / 10 ) + 'px Arial';
            //snakecontext.textAlign = 'left';
            //snakecontext.fillText( snakegame.score, snakecanvas.width / 2, snakecanvas.height * 0.9 );
            $( '.leaderboard-score' ).val( snakegame.score * 100 );
            $( '.timer' ).val( Math.round( snakegame.timer / 10 ) );
            $( '.vitesse' ).val( Math.round( snakegame.fps ) );
            $( '.leaderboard-distance' ).val( Math.round( snakegame.distance * 0.02 * snakegame.fps ) );
        },
        drawMessage: function() {
            if ( snakegame.message !== null ) {
                snakecontext.fillStyle = '#eee';
                snakecontext.strokeStyle = '#000';
                snakecontext.font = ( snakecanvas.height / 4 ) + 'px VT323';
                snakecontext.textAlign = 'center';
                snakecontext.fillText( snakegame.message, snakecanvas.width / 2, snakecanvas.height / 2 );
                snakecontext.strokeText( snakegame.message, snakecanvas.width / 2, snakecanvas.height / 2 );
            }
        },
        resetCanvas: function() {
            snakecontext.clearRect( 0, 0, snakecanvas.width, snakecanvas.height );
        }
    };
    var snakeserpent = {
        size: snakecanvas.width / 40,
        x: null,
        y: null,
        color: '#e23134',
        direction: 'left',
        sections: [],
        init: function() {
            snakeserpent.sections = [];
            snakeserpent.direction = 'left';
            snakeserpent.x = snakecanvas.width / 2 + snakeserpent.size / 2;
            snakeserpent.y = snakecanvas.height / 2 + snakeserpent.size / 2;
            for ( var i = snakeserpent.x + ( 5 * snakeserpent.size ); i >= snakeserpent.x; i -= snakeserpent.size ) {
                snakeserpent.sections.push( i + ',' + snakeserpent.y );
            }
        },
        move: function() {
            switch ( snakeserpent.direction ) {
                case 'up':
                    snakeserpent.y -= snakeserpent.size;
                    break;
                case 'down':
                    snakeserpent.y += snakeserpent.size;
                    break;
                case 'left':
                    snakeserpent.x -= snakeserpent.size;
                    break;
                case 'right':
                    snakeserpent.x += snakeserpent.size;
                    break;
            }
            snakeserpent.checkCollision();
            snakeserpent.checkGrowth();
            snakeserpent.sections.push( snakeserpent.x + ',' + snakeserpent.y );
        },
        draw: function() {
            for ( var i = 0; i < snakeserpent.sections.length; i++ ) {
                snakeserpent.drawSection( snakeserpent.sections[ i ].split( ',' ) );
            }
        },
        drawSection: function( section ) {
            snakegame.drawBox( parseInt( section[ 0 ] ), parseInt( section[ 1 ] ), snakeserpent.size, snakeserpent.color );
        },
        checkCollision: function() {
            if ( snakeserpent.isCollision( snakeserpent.x, snakeserpent.y ) === true ) {
                snakegame.stop();
            }
        },
        isCollision: function( x, y ) {
            if ( x < snakeserpent.size / 2 || x > snakecanvas.width || y < snakeserpent.size / 2 || y > snakecanvas.height || snakeserpent.sections.indexOf( x + ',' + y ) >= 0 ) {
                return true;
            }
        },
        checkGrowth: function() {
            if ( snakeserpent.x == snakefood.x && snakeserpent.y == snakefood.y ) {
                snakegame.score++;
                if ( snakegame.score % 5 === 0 && snakegame.fps < 60 ) {
                    snakegame.fps++;
                }
                snakefood.set();
                snakefood.set();
                /*
                var globalRef = new Firebase( 'https://snakeleader.firebaseio.com/scoreList/global/distanceTotale' );
                globalRef.transaction( function( current ) {
                // If /users/fred/rank has never been set, currentRank will be null.
                //console.log( snakegame.distance );
                return current + ( Math.round( snakegame.distance * 0.02 * snakegame.fps ) );
              } );*/
            } else {
                snakeserpent.sections.shift();
            }
        }
    };
    var snakefood = {
        size: null,
        x: null,
        y: null,
        color: '#eee',
        set: function() {
            snakefood.size = snakeserpent.size;
            snakefood.x = ( Math.ceil( Math.random() * 10 ) * snakeserpent.size * 4 ) - snakeserpent.size / 2;
            snakefood.y = ( Math.ceil( Math.random() * 10 ) * snakeserpent.size * 3 ) - snakeserpent.size / 2;
        },
        draw: function() {
            snakegame.drawBox( snakefood.x, snakefood.y, snakefood.size, snakefood.color );
        }
    };
    /*
    ##         ## ##       ######   #######  ##    ## ######## ########   #######  ##       ########  ######
    ##         ## ##      ##    ## ##     ## ###   ##    ##    ##     ## ##     ## ##       ##       ##    ##
    ##       #########    ##       ##     ## ####  ##    ##    ##     ## ##     ## ##       ##       ##
    ##         ## ##      ##       ##     ## ## ## ##    ##    ########  ##     ## ##       ######    ######
    ##       #########    ##       ##     ## ##  ####    ##    ##   ##   ##     ## ##       ##             ##
    ##         ## ##      ##    ## ##     ## ##   ###    ##    ##    ##  ##     ## ##       ##       ##    ##
    ########   ## ##       ######   #######  ##    ##    ##    ##     ##  #######  ######## ########  ######
    */
    var inverseDirection = {
        'up': 'down',
        'left': 'right',
        'right': 'left',
        'down': 'up'
    };
    var kbd = [];
    //kbd[13]='start_snakegame';
    //kbd[96]='start_snakegame';
    kbd[ 38 ] = 'up';
    kbd[ 104 ] = 'up';
    kbd[ 39 ] = 'right';
    kbd[ 102 ] = 'right';
    kbd[ 40 ] = 'down';
    kbd[ 98 ] = 'down';
    kbd[ 37 ] = 'left';
    kbd[ 100 ] = 'left';
    addEventListener( "keydown", function( e ) {
        var lastKey = kbd[ e.which ];
        //lastKey = Ctrlkeys.getKey( e.keyCode );
        if ( [ 'up', 'down', 'left', 'right' ].indexOf( lastKey ) >= 0 && lastKey != inverseDirection[ snakeserpent.direction ] ) {
            snakeserpent.direction = lastKey;
        } else if ( [ 'start_snakegame' ].indexOf( lastKey ) >= 0 && snakegame.over ) {
            snakegame.start();
        }
    }, false );
    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
    /*
    ##         ## ##      ##        #######   #######  ########
    ##         ## ##      ##       ##     ## ##     ## ##     ##
    ##       #########    ##       ##     ## ##     ## ##     ##
    ##         ## ##      ##       ##     ## ##     ## ########
    ##       #########    ##       ##     ## ##     ## ##
    ##         ## ##      ##       ##     ## ##     ## ##
    ########   ## ##      ########  #######   #######  ##
    */
    function snakeloop() {
        if ( snakegame.over === false ) {
            snakegame.resetCanvas();
            snakegame.drawScore();
            snakeserpent.move();
            snakefood.draw();
            snakeserpent.draw();
            snakegame.drawMessage();
            snakegame.distance++;
        }
        setTimeout( function() {
            requestAnimationFrame( snakeloop );
        }, 1000 / snakegame.fps );
        setTimeout( function() {
            snakegame.timer++;
        }, 1000 );
    }
    requestAnimationFrame( snakeloop );
    $( "canvas#the-game" ).click( function() {
        snakegame.start();
    } );
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
    $( ".entername .submitScore" ).on( 'click', function() {
        updatetheScore();
    } );
    // Helper function that takes a new score snapshot and adds an appropriate row to our leaderboard table.
    function handleScoreAdded( scoreSnapshot, prevScoreName ) {
            var newScoreRow = $( "<tr/>" );
            newScoreRow.append( $( "<td/>" ).append( $( "<em/>" ).html( '<h4>' + scoreSnapshot.val().name + '</h4>' ) ) );
            newScoreRow.append( $( "<td/>" ).text( scoreSnapshot.val().distance + " m" ) );
            var vitesseMoyenne = scoreSnapshot.val().distance / scoreSnapshot.val().timer;
            vitesseMoyenne = Math.round( vitesseMoyenne * 100 ) / 10;
            newScoreRow.append( $( "<td/>" ).text( vitesseMoyenne + " px/s" ) );
            newScoreRow.append( $( "<td/>" ).html( '<h4>' + scoreSnapshot.val().score + '</h4>' ) );
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

    function updatetheScore() {
        var newScore = Number( $( "#scoreInput" ).val() );
        var newDistance = Number( $( "#distanceInput" ).val() );
        var newTimer = Number( $( "#timerInput" ).val() );
        var name = $( "#nameInput" ).val();
        if ( name.length === 0 ) return;
        if ( newScore === 0 ) return;
        $( "#scoreInput" ).val( 0 );
        $( "#distanceInput" ).val( 0 );
        $( "#timerInput" ).val( 0 );
        $( "#vitesseInput" ).val( 0 );
        $( ".entername .submitScore" ).prop( 'disabled', true );
        $( '.entername .leaderboard-score' ).hide();
        $( '.entername .leaderboard-distance' ).hide();
        $( '.entername .text-info' ).hide();
        //if(newScore>snapshot.val().score) {
        var userScoreRef = scoreListRef.push();
        // Use setWithPriority to put the name / score in Firebase, and set the priority to be the score.
        userScoreRef.setWithPriority( {
            name: name,
            score: newScore,
            distance: newDistance,
            timer: newTimer,
            timestamp: Firebase.ServerValue.TIMESTAMP
        }, newScore );
    }
} ] );
