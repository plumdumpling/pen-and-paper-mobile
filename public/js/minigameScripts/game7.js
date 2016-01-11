/* PICKING */

var pinched, pinches;
var game, hammer;
var myPinch;

function startGame (){
  // init variables
  pinched = false;
  pinches = 0;
  game = document.getElementById('game');
  hammer = new Hammer.Manager(game);
  myPinch = new Hammer.Pinch();

  // add pinch recognizer
  hammer.add(myPinch);

  // stop minigame after 30 seconds
  setTimeout(function (){
    hammer.remove(myPinch);
    console.log(pinches+' pinches');
    if(pinches >= 80) stopGame(true);
    else stopGame(false);
  }, 30000);
}

// recognize pinch with hammer library
hammer.on("pinchin, pinchend", function (event){
  if(event.type==="pinchin"){
    pinched = true;
  }
  else if(event.type==="pinchend"){
    // show image at event position
    pickImage(pinches, event.center);
    pinches++;
  }
});

function pickImage (id, position){
  var div = document.createElement('div');
  div.id = 'pick'+id;
  div.className = 'pick';
  // set position to event center
  $(div).css('left', position.x+'px');
  $(div).css('top', position.y+'px');
  // randomize
  var randomInt = (Math.random()*140)-69;
  $(div).css('-webkit-transform', 'rotate('+randomInt+'deg)');
  $(div).css('-moz-transform', 'rotate('+randomInt+'deg)');
  $(div).css('-o-transform', 'rotate('+randomInt+'deg)');
  $(div).css('transform', 'rotate('+randomInt+'deg)');
  $(div).css('width', (60+(Math.random()*20))+'px');

  // show pick image for 600 ms
  $('#game').append(div);
  setTimeout(function (){
    $('#pick'+id).remove();
  }, 600);
}
