/* HIDING */

var stopped, start, currentValue;

function startGame (){
  // init variables
  stopped = false;
  start = false;
  currentValue = 0;

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

  setInterval(function (){
    $('#game').attr('data-value', currentValue);
    $('.performance').each(function (){
      if(parseInt($(this).attr('data-value')) <= currentValue) $(this).addClass('visible');
      else $(this).removeClass('visible');
    });
  }, 500);
}

function motion (event){
  // start recognition if the device doesn't move much
  if(!start && event.acceleration.x<0.7 && event.acceleration.y<0.7 && event.acceleration.z<0.7) start = true;

  if(start){
    // get rotation values
    var allValues = [event.acceleration.x, event.acceleration.y, event.acceleration.z]
    var maxValue = Math.max.apply(Math, allValues);
    currentValue = Math.abs(Math.floor(maxValue*10));

    if(maxValue>=0.7){
      // player failed - game over
      window.removeEventListener("devicemotion", motion, false);
      stopped = true;
      stopGame(false);
      $('#performanceBar').css('display', 'none');
    }
  }
}
