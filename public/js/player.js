/* DRAGGABILLY */
var intersection = null;
var scrollInterval;
var isScrolling = false;
var parent = null;

/* INITIALIZE DRAGGABLES */
Array.prototype.slice.call(document.querySelectorAll('.draggable')).forEach(function (elem){
	this.draggie = new Draggabilly(elem, {
		containment: document.body,
		appendTo: document.body
	});

	// some event listeners for draggables
	this.draggie.on('dragStart', startDragging);
	this.draggie.on('dragMove', moveDragging);
	this.draggie.on('dragEnd', endDragging);

	// custom options for draggables
	this.draggie.customOptions = {
		moveBack: true,
		scrollArea: '#inventory .bottom'
	}
});

function startDragging (draggie, event, pointer){
	// remember parent element
	if(!parent) parent = $(this.element).parent();
	console.log($(parent));

	highlightIntersection(this.element);

	// show trash box
	$('#trash').addClass('visible');

	// append element to body
	$(this.element).css('margin-left', $(this.element).offset().left);
	$(this.element).css('margin-top', $(this.element).offset().top);
	$(this.element).appendTo('body');
}

function moveDragging (draggie, event, pointer){
	highlightIntersection(this.element);

	if(intersectionOf($('#sidebar')[0], this.element)){
		// open sidebar and show shadowbox
		$('#sidebar').addClass('open');
    $('#inventory').addClass('visible');
		$('#sidebar #buttons button[data-content="inventory"]').addClass('active');
		$('#shadowBox').addClass('visible');
		$('#shadowBox').css('z-index', '45');

		// check position for scrolling
		var offset = this.element.getBoundingClientRect();
		if(offset.top <= 30){
			// scroll up
			if(!isScrolling){
				isScrolling = true;
				scrollInterval = setInterval(function(){
					var pos = $('#inventory .bottom').scrollTop();
					if(pos>0){
						$('#inventory .bottom').scrollTop(--pos);
					}
					else{
						isScrolling = false;
						clearInterval(scrollInterval);
					}
				}, 10);
			}
		}
		else if((offset.top+this.element.offsetHeight) >= ($('#inventory .bottom')[0].offsetHeight-30)){
			// scroll down
			if(!isScrolling){
				isScrolling = true;
				scrollInterval = setInterval(function(){
					var pos = $('#inventory .bottom').scrollTop();
					if(pos<$('#inventory .bottom')[0].scrollHeight-$('#inventory .bottom')[0].offsetHeight){
						$('#inventory .bottom').scrollTop(++pos);
					}
					else{
						isScrolling = false;
						clearInterval(scrollInterval);
					}
				}, 10);
			}
		}
		else if(isScrolling){
			// stop scrolling
			isScrolling = false;
			clearInterval(scrollInterval);
		}
		return false;
	}
	else{
		if(isScrolling){
			// stop scrolling
			isScrolling = false;
			clearInterval(scrollInterval);
		}
	}
}

function endDragging (draggie, event, pointer){
	// check draggable for intersection with slots
	if(intersection!=null){
		if($(intersection).attr('id') === 'trash'){
			$(this.element).remove();
		}
		else{
			// attach draggable to slot
			$(intersection).addClass('filled');
			$(this.element).css('margin-left', '0');
			$(this.element).css('margin-top', '0');
			$(intersection).append(this.element);
		}
		$(parent).removeClass('filled');
		parent = null;
	}
	else{
		// move draggable to its default position
		if(this.customOptions.moveBack){
			$(this.element).animate({
				left: '0px',
				top: '0px'
			}, returnToParent(this.element));
		}
	}

	if(isScrolling){
		// stop scrolling
		isScrolling = false;
		clearInterval(scrollInterval);
	}

	// update view
	$('#filledSlots').html($('.slot.filled').length);

	// hide trash box
	$('#trash').removeClass('visible');

	saveInventory();
}

function returnToParent (draggable){
	$(draggable).css('margin-left', '0');
	$(draggable).css('margin-top', '0');
	$(parent).append(draggable);
	parent = null;
}


/* INITIALIZE SLOTS */
var slotsArr = [];
Array.prototype.slice.call(document.querySelectorAll('.slot')).forEach(function (elem){
	slotsArr.push(elem);
});

function highlightIntersection (draggable){
	intersection = null;

	// check draggable for intersection with slots and highlight intersected slot
	for(var i=0; i<slotsArr.length; i++) {
		if(intersectionOf(slotsArr[i], draggable)){
			$(slotsArr[i]).addClass('highlight');
			intersection = slotsArr[i];
			return;
		}
		else $(slotsArr[i]).removeClass('highlight');
	}

	// check draggable for intersection with content div
	if(intersectionOf(document.getElementById('itemsReceiver'), draggable)){
		$('#itemsReceiver').addClass('highlight');
		intersection = document.getElementById('itemsReceiver');
	}
	else{
		$('#itemsReceiver').removeClass('highlight');
	}

	// check draggable for intersection with trash box and highlight intersected trash
	if(intersectionOf(document.getElementById('trash'), draggable)){
		$('#trash').addClass('highlight');
		intersection = document.getElementById('trash');
		return;
	}
	else $('#trash').removeClass('highlight');
}

function intersectionOf (element, draggable){
	// check if slot is already filled
	if($(element).hasClass('filled')) return false;

	var offsetA = element.getBoundingClientRect();
	var widthA = element.offsetWidth;
	var heightA = element.offsetHeight;

	var offsetB = draggable.getBoundingClientRect();
	var widthB = draggable.offsetWidth;
	var heightB = draggable.offsetHeight;

	// check if the center of the draggable is inside the element
	if(offsetA.top > offsetB.top+heightB/2 ||
		offsetA.top+heightA < offsetB.top+heightB/2 ||
		offsetA.left > offsetB.left+widthB/2 ||
		offsetA.left+widthA < offsetB.left+widthB/2) {
		return false;
	}
	else return true;
}
