/* SIDEBAR */
function toggleSidebar(contentType) {
  // check if sidebar is open or not
	if($('#sidebar').hasClass('open')){
		// close sidebar and hide shadowbox
		$('#sidebar').removeClass('open');
		// remove all marks from buttons
		$('#sidebar #buttons button').each(function (){
			$(this).removeClass('active');
		});
		// hide sidebar content when sidebar is closed
		setTimeout(function(){
			$('#sidebarContent div').each(function (){
				$(this).removeClass('visible');
			});
			$('#shadowBox').removeClass('visible');
			$('#shadowBox').css('z-index', '55');
		}, 300);
	}
	else{
		// open sidebar and show shadowbox
		$('#sidebar').addClass('open');
    $('#'+contentType).addClass('visible');
		$('#shadowBox').addClass('visible');
		$('#shadowBox').css('z-index', '45');
	}
}

/* POPUPS */
function popup (headline, paragraph){
  // fill popup with text
	if(paragraph) $('#popupInner').html('<h3>'+headline+'</h3><p>'+paragraph+'</p><a onClick="closePopup();">OK</a>');
	else $('#popupInner').html('<h3>'+headline+'</h3><a onClick="closePopup();">OK</a>');
  // show popup
  $('#popup').removeClass('hide');
  $('#shadowBox').addClass('visible');
}

function popupWithContent (text, content, functions){
	// fill popup with text
	$('#popupInner').html('<h3>'+text+'</h3>');
	// add content to popup
	if(content) $('#popupInner').append(content);
	// add functions to popup
	for(var i=0; i<functions.length; i++){
		$('#popupInner').append('<a onClick="'+functions[i].f+';">'+functions[i].title+'</a>');
	}
	// show popup
	$('#popup').removeClass('hide');
	$('#shadowBox').addClass('visible');
}

function closePopup (){
  // hide popup
  $('#popup').addClass('hide');
  $('#shadowBox').removeClass('visible');
}

/* POPUP FOR FORMS ON LANDING PAGE */
function formPopup (text){
  // fill popup with text
	$('#popupInner').html('<p>'+text+'</p><a onClick="closeFormPopup();">OK</a>');
	$('#popup').addClass('form');
  // show popup
  $('#popup').removeClass('hide');
}

function closeFormPopup (){
  // hide popup
  $('#popup').addClass('hide');
	$('#popup').removeClass('form');
}

/* DICE POPUP */
function closeDiceBox (){
  // hide and clear dice box popup
  $('#diceBox').parent().addClass('hide');
	$('#diceBox').empty();
  $('#shadowBox').removeClass('visible');
}

/* NOTIFICATIONS */
var notificationsCount = 0;
function notification (text){
	// create notification div
	var div = document.createElement('div');
	div.className = 'notification';
	// get an id for the notification
	var thisID = 'no'+notificationsCount;
	notificationsCount++;
	div.id = thisID;
	// fill notification with text
	div.innerHTML = '<p>'+text+'</p><a class="close" onClick="closeNotification(this);"></a>';

	$('#notifications').append(div);

	// show notification for 4 seconds
	$('#'+thisID).addClass('visible');
	setTimeout(function (){
		$('#'+thisID).removeClass('visible');
		setTimeout(function (){
			// animate div to height 0 to close the gap
			$('#'+thisID).css('height', $('#'+thisID).height());
			$('#'+thisID).css('min-height', '0');
			$('#'+thisID).css('padding', '0');
			$('#'+thisID).animate({height: '0'}, 200, function(){
				$('#'+thisID).remove();
			});
		}, 1000);
	}, 4000);
}

function closeNotification (sender){
	$('#'+$(sender).parent().attr('id')).removeClass('visible');
	setTimeout(function (){
		// animate div to height 0 to close the gap
		$('#'+$(sender).parent().attr('id')).css('height', $('#'+$(sender).parent().attr('id')).height());
		$('#'+$(sender).parent().attr('id')).css('min-height', '0');
		$('#'+$(sender).parent().attr('id')).css('padding', '0');
		$('#'+$(sender).parent().attr('id')).animate({height: '0'}, 200, function(){
			$('#'+$(sender).parent().attr('id')).remove();
		});
	}, 1000);
}

/* ALLOW TRANSITIONS AFTER PAGE LOAD */
$(window).load(function (){
  $('body').removeClass('preload');
});

/* ADDRESS BAR */
// hide the address bar on mobile browsers
$(document).ready(function (){
  window.addEventListener("load", function(){
    setTimeout(function (){
      window.scrollTo(0, 1);
    }, 100);
  });
});
