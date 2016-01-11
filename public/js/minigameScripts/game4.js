/* CLIMBING */

var toTheRight, steps, even;

function startGame (){
  // init variables
  toTheRight = true;
  steps = 0;
  even = false;

  // init recognition and the value of the players performance
  window.addEventListener("deviceorientation", orientationChange, false);
  $('#game').attr('data-value', '0');
  $('#climbBar').css('display', 'block');

  // stop minigame after 30 seconds
  setTimeout(function (){
    window.removeEventListener("deviceorientation", orientationChange, false);
    $('#climbBar').css('display', 'none');
    $('#climbBar').empty();

    console.log(steps+' steps');
    if(steps >= 100) stopGame(true);
    else stopGame(false);
  }, 30000);
}

function orientationChange (event){
  console.log(Math.floor(event.alpha)+' '+Math.floor(event.beta)+' '+Math.floor(event.gamma));
  if((toTheRight && event.gamma>=40) || (!toTheRight && event.gamma<=-40)){
    // climb one step further
    toTheRight = !toTheRight;
    steps++;
    if(even){
      if((steps%10)==0) $('#climbBar').prepend('<div class="step even colored"></div>');
      else $('#climbBar').prepend('<div class="step even"></div>');
    }
    else{
      if((steps%10)==0) $('#climbBar').prepend('<div class="step odd colored"></div>');
      else $('#climbBar').prepend('<div class="step odd"></div>');
    }
    even = !even;
  }
}
