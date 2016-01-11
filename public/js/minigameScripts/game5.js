/* SWIMMING */

var upLeft, upRight;
var leftHammer;
var rightHammer;
var up, left, down;
var rup, right, rdown;
var distance;

function startGame (){
  // init variables
  upLeft = document.getElementById('upLeft');
  upRight = document.getElementById('upRight');
  leftHammer = new Hammer(upLeft);
  rightHammer = new Hammer(upRight);
  up = true;
  left = false;
  down = false;
  rup = true;
  right = false;
  rdown = false;
  distance = 0;

  // add pan recognizers
  leftHammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
  rightHammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

  // init the value of the players performance
  $('#left').attr('data-value', '0');
  $('#right').attr('data-value', '0');

  $('#left').css('display', 'inline-block');
  $('#left div').css('display', 'inline-block');
  $('#left svg.swimming').css('display', 'block');
  $('#right').css('display', 'inline-block');
  $('#right div').css('display', 'inline-block');
  $('#right svg.swimming').css('display', 'block');

  // stop minigame after 30 seconds
  setTimeout(function (){
    $('#left').css('display', 'none');
    $('#left div').css('display', 'none');
    $('#left svg.swimming').css('display', 'none');
    $('#right').css('display', 'none');
    $('#right div').css('display', 'none');
    $('#right svg.swimming').css('display', 'none');

    console.log(distance+' distance');
    if(distance >= 50) stopGame(true);
    else stopGame(false);
  }, 30000);
}

// recognize swimming move left
var lProgress = 0;
leftHammer.on("panup panleft pandown panend", function(event) {
  if(event.type=="panend"){
    // reset variables for next swimming move
    up = true;
    left = false;
    down = false;
    $('#left').attr('data-value', '0');

    // reset svg color
    $('#left svg.swimming path').each(function (index){
      $(this).attr('fill', '#ffffff');
    });

    // count swimming distance
    distance += lProgress;
    lProgress = 0;
  }
  else if(event.type=="panup"){
    if(event.distance<= 15) $('#left').attr('data-value', '0');
    if(event.distance>15 && event.distance<= 30) $('#left').attr('data-value', '1');
    if(event.distance>30) $('#left').attr('data-value', '2');
    updateSvg('left');
  }
  else if(event.type=="panleft"){
    if(event.distance<= 45) $('#left').attr('data-value', '3');
    if(event.distance>45 && event.distance<= 60) $('#left').attr('data-value', '4');
    if(event.distance>60) $('#left').attr('data-value', '5');
    updateSvg('left');
  }
  else if(event.type=="pandown"){
    if(event.distance<= 75) $('#left').attr('data-value', '6');
    if(event.distance>75 && event.distance<= 90) $('#left').attr('data-value', '7');
    if(event.distance>90 && event.distance<= 105) $('#left').attr('data-value', '8');
    if(event.distance>105 && event.distance<= 120) $('#left').attr('data-value', '9');
    if(event.distance>120 && event.distance<= 135) $('#left').attr('data-value', '10');
    if(event.distance>135 && event.distance<= 150) $('#left').attr('data-value', '11');
    if(event.distance>150 && event.distance<= 165) $('#left').attr('data-value', '12');
    if(event.distance>165 && event.distance<= 180) $('#left').attr('data-value', '13');
    if(event.distance>180 && event.distance<= 195) $('#left').attr('data-value', '14');
    if(event.distance>195) $('#left').attr('data-value', '15');
    updateSvg('left');
  }

  if(up && event.deltaX > -20 && event.deltaY <= -60){
    up = false;
    left = true;
  }
  if(!up && left && event.deltaX <= -60 && event.deltaY <= -20){
    left = false;
    down = true;
    lProgress++;
  }
  if(!up && !left && down && event.deltaX <= -20 && event.deltaY >= 80){
    down = false;
    up = true;
    lProgress++;
  }
});

// recognize swimming move right
var rProgress = 0;
rightHammer.on("panup panright pandown panend", function(event) {
  if(event.type=="panend"){
    // reset variables for next swimming move
    rup = true;
    right = false;
    rdown = false;
    $('#right').attr('data-value', '0');

    // reset svg color
    $('#right svg.swimming path').each(function (index){
      $(this).attr('fill', '#ffffff');
    });

    // count swimming distance
    distance += rProgress;
    rProgress = 0;
  }
  else if(event.type=="panup"){
    if(event.distance<= 15) $('#right').attr('data-value', '0');
    if(event.distance>15 && event.distance<= 30) $('#right').attr('data-value', '1');
    if(event.distance>30) $('#right').attr('data-value', '2');
    updateSvg('right');
  }
  else if(event.type=="panright"){
    if(event.distance<= 45) $('#right').attr('data-value', '3');
    if(event.distance>45 && event.distance<= 60) $('#right').attr('data-value', '4');
    if(event.distance>60) $('#right').attr('data-value', '5');
    updateSvg('right');
  }
  else if(event.type=="pandown"){
    if(event.distance<= 75) $('#right').attr('data-value', '6');
    if(event.distance>75 && event.distance<= 90) $('#right').attr('data-value', '7');
    if(event.distance>90 && event.distance<= 105) $('#right').attr('data-value', '8');
    if(event.distance>105 && event.distance<= 120) $('#right').attr('data-value', '9');
    if(event.distance>120 && event.distance<= 135) $('#right').attr('data-value', '10');
    if(event.distance>135 && event.distance<= 150) $('#right').attr('data-value', '11');
    if(event.distance>150 && event.distance<= 165) $('#right').attr('data-value', '12');
    if(event.distance>165 && event.distance<= 180) $('#right').attr('data-value', '13');
    if(event.distance>180 && event.distance<= 195) $('#right').attr('data-value', '14');
    if(event.distance>195) $('#right').attr('data-value', '15');
    updateSvg('right');
  }

  if(rup && event.deltaX < 20 && event.deltaY <= -60){
    rup = false;
    right = true;
  }
  if(!rup && right && event.deltaX > 60 && event.deltaY <= -20){
    right = false;
    rdown = true;
    rProgress++;
  }
  if(!rup && !right && rdown && event.deltaX > 20 && event.deltaY >= 80){
    rdown = false;
    rup = true;
    rProgress++;
  }
});

function updateSvg (side){
  // update svg color
  $('#'+side+' svg.swimming path').each(function (index){
    if($('#'+side).attr('data-value') >= index) $(this).attr('fill', '#b1e06e');
    else $(this).attr('fill', '#ffffff');
  });
}
