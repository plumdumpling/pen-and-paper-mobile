/* BALANCING */

var stopped;
var interval, neededRotation, reachedRotation;
var countdown, countdownRunning, counter;

function startGame (){
  // init variables
  stopped = false;
  neededRotation = 0;
  reachedRotation = true;
  countdownRunning = false;
  counter = 20;

  // init recognition and the value of the players performance
  window.addEventListener("deviceorientation", orientationChange, false);
  $('#game').attr('data-value', '0');
  $('#balanceBar').css('display', 'block');
  $('#balanceBarControl').css('display', 'block');

  // stop minigame after 30 seconds
  setTimeout(function (){
    if(!stopped){
      window.removeEventListener("deviceorientation", orientationChange, false);
      $('#balanceBar').css('display', 'none');
      $('#balanceBarControl').css('display', 'none');
      stopGame(true);
    }
  }, 30000);

  // set an interval for the needed rotation, which changes every 2 seconds
  interval = setInterval(function (){
    // get a new rotation if the player reached the last one
    if(reachedRotation){
      neededRotation = (Math.floor(Math.random()*20)-9)*4;
      $('#balanceBar').attr('data-rotation', -neededRotation);
      reachedRotation = false;
    }
    else if(parseInt($('#game').attr('data-value'))<5){
      $('#game').attr('data-value', parseInt($('#game').attr('data-value'))+1);
    }
  }, 600);
}

function orientationChange (event){
  $('#balanceBarControl').css('-webkit-transform', 'rotate('+(-event.gamma/2)+'deg)');
  $('#balanceBarControl').css('-moz-transform', 'rotate('+(-event.gamma/2)+'deg)');
  $('#balanceBarControl').css('-o-transform', 'rotate('+(-event.gamma/2)+'deg)');
  $('#balanceBarControl').css('transform', 'rotate('+(-event.gamma/2)+'deg)');

  if(event.gamma<=(neededRotation*2)+10 && event.gamma>=(neededRotation*2)-10){
    // good job
    reachedRotation = true;
    $('#game').attr('data-value', '0');

    // stop counter if user is balancing again
    clearInterval(countdown);
    countdownRunning = false;
  }
  else{
    // start countdown if player doesn't balance well
    if(!countdownRunning){
      countdownRunning = true;
      countdown = setInterval(function (){
        counter--;
      }, 1000);
    }

    if(parseInt($('#game').attr('data-value'))>=5 || counter<=0){
    // player failed - game over
      window.removeEventListener("deviceorientation", orientationChange, false);
      clearInterval(countdown);
      clearInterval(interval);
      stopped = true;
      stopGame(false);
      $('#balanceBar').css('display', 'none');
      $('#balanceBarControl').css('display', 'none');
      $('#game').attr('data-value', '0');
    }
  }
}
