/* SHAKING */

var stopped, countdown, countdownRunning, counter;

function startGame (){
  // init variables
  stopped = false;
  countdownRunning = false;
  counter = 20;

  // init recognition and the value of the players performance
  window.addEventListener("devicemotion", motion, false);
  $('#game').attr('data-value', '0');
  $('#performanceBar').css('display', 'block');

  // stop minigame after 30 seconds
  setTimeout(function (){
    if(!stopped){
      $('#performanceBar').css('display', 'none');
      stopGame(true);
    }
  }, 30000);
}

function motion (event){
  // get rotation values
  var allValues = [Math.abs(event.acceleration.x), Math.abs(event.acceleration.y), Math.abs(event.acceleration.z)];
  var maxValue = Math.max.apply(Math, allValues);
  var dataValue = (5-Math.floor(maxValue/2));
  if(dataValue<0) dataValue = 0;
  $('#game').attr('data-value', dataValue);
  $('.performance').each(function (){
    if(parseInt($(this).attr('data-value')) <= dataValue) $(this).addClass('visible');
    else $(this).removeClass('visible');
  });

  if(maxValue<10) {
    // start countdown if player stops shaking the device
    if(!countdownRunning){
      countdownRunning = true;
      countdown = setInterval(function (){
        counter--;
      }, 100);
    }

    if(counter<=0){
      // player failed - game over
      window.removeEventListener("devicemotion", motion, false);
      clearInterval(countdown);
      stopped = true;
      stopGame(false);
      $('#performanceBar').css('display', 'none');
    }
  }
  else{
    // stop counter if user is shaking again
    clearInterval(countdown);
    countdownRunning = false;
  }
}
