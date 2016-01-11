/* RUNNING */

var left, right;
var leftProgress, rightProgress;
var distance;

var leftHammer, rightHammer;

function startGame (){
  // init variables
  left = document.getElementById('left');
  right = document.getElementById('right');
  leftProgress = 0;
  rightProgress = 0;
  distance = 0;
  leftHammer = new Hammer(left);
  rightHammer = new Hammer(right);

  // add pan recognizers
  leftHammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
  rightHammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

  // init the value of the players performance
  $('#left').attr('data-value', '0');
  $('#right').attr('data-value', '0');

  $('#left').css('display', 'inline-block');
  $('#left svg.running').css('display', 'block');
  $('#right').css('display', 'inline-block');
  $('#right svg.running').css('display', 'block');

  // stop minigame after 30 seconds
  setTimeout(function (){
    $('#left').css('display', 'none');
    $('#left svg.running').css('display', 'none');
    $('#right').css('display', 'none');
    $('#right svg.running').css('display', 'none');

    console.log(distance+' distance');
    if(distance >= 45000) stopGame(true);
    else stopGame(false);
  }, 30000);
}

// recognize steps on the left
leftHammer.on("pandown panend", function (event){
  if(event.type=="panend"){
    if(leftProgress>=3) distance+=event.deltaY;
    // reset variables and svg color
    leftProgress = 0;
    $('#left').attr('data-value', '0');
    $('#left svg.running path').each(function (index){
      $(this).attr('fill', '#ffffff');
    });
  }
  else{
    leftProgress = Math.floor(event.deltaY/20);
    if(leftProgress>10) leftProgress = 10;
    if($('#left').attr('data-value') < leftProgress) $('#left').attr('data-value', leftProgress);

    // update svg color
    $('#left svg.running path').each(function (index){
      if($('#left').attr('data-value') >= index) $(this).attr('fill', '#b1e06e');
      else $(this).attr('fill', '#ffffff');
    });
  }
});

// recognize steps on the right
rightHammer.on("pandown panend", function (event){
  if(event.type=="panend"){
    if(rightProgress>=3) distance+=event.deltaY;
    // reset variables and svg color
    rightProgress = 0;
    $('#right').attr('data-value', '0');
    $('#right svg.running path').each(function (index){
      $(this).attr('fill', '#ffffff');
    });
  }
  else{
    rightProgress = Math.floor(event.deltaY/20);
    if(rightProgress>10) rightProgress = 10;
    if($('#right').attr('data-value') < rightProgress) $('#right').attr('data-value', rightProgress);

    // update svg color
    $('#right svg.running path').each(function (index){
      if($('#right').attr('data-value') >= index) $(this).attr('fill', '#b1e06e');
      else $(this).attr('fill', '#ffffff');
    });
  }
});
