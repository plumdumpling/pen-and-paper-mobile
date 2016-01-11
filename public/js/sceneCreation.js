// variables to save and count user created buttons
var buttons = [];
// variables to save user selection
var userSelection, range, html;

$(document).on('click', '#sceneDescription button', function (event){
	event.preventDefault();

	// show keyword's info
	var name = $(this).attr('name');
	$('#keywordsScenes div').each(function (){
		if($(this).attr('id')===name) $(this).removeClass('hide');
		else $(this).addClass('hide');
	});
	$('#keywordsInfo').removeClass('hide');
	$('#keywordsScenes').removeClass('hide');
	$('#shadowBox').addClass('visible');
});

$('#closeKeyword').on('click', function (){
	// close keyword's info
	$('#keywordsInfo').addClass('hide');
	$('#shadowBox').removeClass('visible');
});

$('body').on('mouseup mouseleave touchend touchcancel', function (event){
	if($(event.target).attr('id') === 'closeKeyword') return;

	// check if text is selected
	// timeout for recognizing touch based selections
	setTimeout(function (){
		getTextSelection(event.target);
	}, 100);
});

$(document).on('mousedown touchstart', function (event){
	// check if clicked element is button
	var target = event.target;
	console.log(target);
	if(!$(target).is('button') && !$(target).parent().is('button')){
		// clear selection if clicked element is no button
		if(window.getSelection){
			// Webkit
			if(window.getSelection().empty){
				window.getSelection().empty();
			}
			// Firefox
			else if(window.getSelection().removeAllRanges){
				window.getSelection().removeAllRanges();
			}
		}
		// IE
		else if(document.selection){
			document.selection.empty();
		}

		// hide all buttons
		$('#addBtn').css('opacity','0');
		$('#styleBtns').css('opacity','0');
	}
});

function getTextSelection (target){
	// get user selected text
	if (window.getSelection) {
		// Webkit, Firefox
		userSelection = window.getSelection();
		if (userSelection.rangeCount) {
			// selected Text
			range = userSelection.getRangeAt(0);
		}
	}
	// IE
	else if (document.selection && document.selection.createRange) {
		// selected Text
		range = document.selection.createRange();
	}
	else{
		range = document.getSelection.getRangeAt(0);
	}

	if(!range) return false;

	// get selection position on screen
	rangeCopy = range.cloneRange();
	var x, y;
	if (rangeCopy.getClientRects) {
			rangeCopy.collapse(true);

			var rect = range.getClientRects();
			if(rect.length > 0) rect = range.getClientRects()[0];

			x = rect.left;
			y = rect.top;
	}
	// place button at selection
	$('#addBtn').css('left', x+'px');
	$('#addBtn').css('top', y+'px');

	// check if text is selected
	if(!range || range.toString()===''){
		// hide all buttons if there is no text selected
		$('#addBtn').css('opacity','0');
		$('#styleBtns').css('opacity','0');
	}
	else{
		// check if selected element is child of info container
		var parents = $(target).parents();
		var childOfInfo = false;
		for (var i=0; i<parents.length; i++) {
			if(parents[i].id==='keywordsInfo') {
				childOfInfo = true;
			}
		}

		if(childOfInfo && ($(target).is('p') || $(target).parent().is('p') || $(target).is('li'))){
			// show buttons for selected text in info container
			$('#styleBtns').css('opacity','1');
		}
		else if(target.id==='sceneDescription' || $(target).parent().attr('id')==='sceneDescription'){
			// show button for selected text in scene description
			$('#addBtn').css('opacity','1');
		}
	}
}

// toggle selection style
$(document).on('click', '#styleBtns button', function (event){
	event.preventDefault();

	document.execCommand($(this).attr('data-style'), false, null);
});

function addButton (){
	var label, matches;

	if(range && range.toString()!==''){
		// get user selected text in HTML
		if (window.getSelection) {
			// convert selection to HTML
			var container = document.createElement('div');
			for (var i=0; i<userSelection.rangeCount; i++) {
				container.appendChild(userSelection.getRangeAt(i).cloneContents());
			}
			html = container.innerHTML;
		} else if (document.selection && document.selection.createRange) {
			// selection in HTML
			html = range.htmlText;
		}
	}
	// return function if no text is selected
	else return false;

	var removedBtns = [];
	// check if there is a button in selection
	matches = html.match(/<button name="scene_[0-9]+">+/g);
	if(matches){
		for(var i=0; i<matches.length; i++){
			label = html;
			// remove button tags
			label = label.replace(matches[i],'');
			label = label.replace('</button>','');
			// remember name of selected and removed button
			removedBtns.push(matches[i].split('"')[1]);
		}
	}
	// if no button has to be removed, take selected text as label
	if(removedBtns.length<=0) label = range;

	// check if buttons were removed
	if(removedBtns.length>0){
		// replace selection
		document.execCommand('insertHTML', null, label);

		var index;
		for(var i=0; i<removedBtns.length; i++){
			// check if button was fully removed or just cut
			if(html.indexOf('<button name="'+removedBtns[i]+'">')!==0 && html.indexOf('</button>')<html.length-9){
				// remove info paragraph of removed button
				$('#keywordsScenes #'+removedBtns[i]).remove();

				// remove name of removed button from array
				index = buttons.indexOf(removedBtns[i]);
				buttons.splice(index, 1);
			}
			// check if two buttons were merged
			else if(html.match(/<button/g).length>1 && i>0){
				// remove info paragraph of removed button and merge content with first button
				$('#keywordsScenes #'+removedBtns[0]+' h3').text($('button[name='+removedBtns[0]+']').text());
				$('#keywordsScenes #'+removedBtns[0]+' p').html($('#keywordsScenes #'+removedBtns[0]+' p').text()+'<br>'+$('#keywordsScenes #'+removedBtns[i]+' p').text());
				$('#keywordsScenes #'+removedBtns[i]).remove();

				// remove name of removed button from array
				index = buttons.indexOf(removedBtns[i]);
				buttons.splice(index, 1);
			}
		}
	}
	else{
		// add info div for button
		var div = document.createElement('div');
		$(div).attr('id','scene_'+parseInt(Date.now()/1000))
		$(div).append('<h3 contenteditable="true">'+label+'</h3><p contenteditable="true"></p>');
		$('#keywordsScenes').append(div);

		// add button name to array
		buttons.push('scene_'+parseInt(Date.now()/1000));

		// replace selection
		document.execCommand('insertHTML', null, '&nbsp;<button name="scene_'+parseInt(Date.now()/1000)+'">'+label+'</button>&nbsp;');
	}

	// fix button in button problem
	btnInBtnFix();

	return false;
}

function btnInBtnFix (){
	// fix button in button problem
	var sceneDescription = document.getElementById('sceneDescription').innerHTML;
	// look for button in button
	var matches = sceneDescription.match(/<button name="scene_[0-9]+"><button name="scene_[0-9]+">+/g);
	if(matches){
		for(var i=0; i<matches.length; i++){
			// position of button in button opening tag
			var matchIndex = sceneDescription.indexOf(matches[i]);

			// remove doubled button opening tag
			sceneDescription = sceneDescription.replace(matches[i],'<button name="'+matches[i].split('"')[3]+'">');
			// replace following button closing tag with second button opening tag
			var pos = sceneDescription.indexOf('</button>', matchIndex);
			sceneDescription = sceneDescription.replaceAt(pos, 9, '<button name="'+matches[i].split('"')[1]+'">');

			// update view
			document.getElementById('sceneDescription').innerHTML = sceneDescription;
		}
	}
}

// replace function working with positions instead of substrings
String.prototype.replaceAt = function (pos, range, characters){
	return this.substring(0, pos) + characters + this.substring(pos+range, this.length);
}

// add p tag for next line by pressing enter
$('#keywordsScenes').keydown(function (event){
	if(event.keyCode===13) document.execCommand('formatBlock', false, 'p');
});
