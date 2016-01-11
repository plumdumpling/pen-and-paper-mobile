/* STEPS CHANGE */
var steps = <% if(contentType==='characters'){ %>5<% }else if(contentType==='scenes'){ %>4<% }else{ %>3<% } %>;
if(createInGame) steps = 6;
var currentStep = 1;
if(createInGame) currentStep = 0;

$(document).on('click', '#next', function (){
  scrollTo(currentStep+1);
});

function scrollTo (step){
  // check if a next step is available
  if(createInGame && (step<0 || step>steps)) return false;
  else if(!createInGame && (step<=0 || step>steps)) return false;

  // update step variable
  currentStep = parseInt(step);

  // update progress
  updateProgress();

  // scroll to step
  var pos;
  if(createInGame) pos = $('.step').width()*(step) + 40*(step);
  else pos = $('.step').width()*(step-1) + 40*(step-1);
  $('#inner').animate({scrollLeft: pos}, 800, function(){

    // mark current step div as current
    $('.step').each(function (){
      if($(this).attr('data-step') == step){
        $(this).addClass('current');
        // check if current step needs drawing options
        if($(this).attr('data-title') == 'Aussehen') $('#drawToolBtn').removeClass('hidden');
        else $('#drawToolBtn').addClass('hidden');
      }
      else{
        $(this).removeClass('current');
      }
    });
  });
}

function updateProgress(){
  // update progress icon
  $('.progressStep').each(function (){
    if($(this).attr('data-step') == currentStep) $(this).addClass('current');
    else $(this).removeClass('current');
  });

  // check if scrolled to last step
  if(!createInGame && (currentStep == steps) ||
    createInGame && (currentStep == steps-1)){
    // change "next" button function to "save" function
    $('#next').addClass('hide');
    $('#save').removeClass('hide');
  }
  else{
    // change "save" button function to "next" function
    $('#save').addClass('hide');
    $('#next').removeClass('hide');
  }

  // update progress text
  var stepTitle;
  $('.step').each(function (){
    if($(this).attr('data-step') == currentStep) stepTitle = $(this).attr('data-title');
  });
  var stepCount;
  if(createInGame) stepCount = currentStep+1;
  else stepCount = currentStep;
  document.getElementById('progressDescription').innerHTML = '<span class="stepCount">Schritt '+stepCount+'</span> - '+stepTitle;
}

$(document).on('click', '.progressStep', function (){
  scrollTo($(this).attr('data-step'));
});
