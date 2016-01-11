/* DRAGGABILLY */
var intersection = null;

/* INITIALIZE DRAGGABLES */
function initializeDraggables (){
	Array.prototype.slice.call(document.querySelectorAll('.draggable')).forEach(function (elem){
		this.draggie = new Draggabilly(elem, {
			containment: document.body
		});

		// some event listeners for draggables
		this.draggie.on('dragStart', startDragging);
		this.draggie.on('dragMove', moveDragging);
		this.draggie.on('dragEnd', endDragging);

		// custom options for draggables
		this.draggie.customOptions = {
			moveBack: true,
			scrollArea: false
		}
	});
}

function startDragging (draggie, event, pointer){
	if($(this.element).hasClass('player')) highlightEnemie(this.element);
	else if($(this.element).hasClass('enemies')) highlightPlayer(this.element);
}

function moveDragging (draggie, event, pointer){
	if($(this.element).hasClass('player')) highlightEnemie(this.element);
	else if($(this.element).hasClass('enemies')) highlightPlayer(this.element);

	draggableMoving = true;
}

function endDragging (draggie, event, pointer){
	if($(this.element).hasClass('player')){
		// check draggable player for intersection with enemie
		if(intersection!=null && $(intersection).hasClass('enemies')){
			// attack enemie
			attackEnemie(intersection, this.element);
		}
	}
	else if($(this.element).hasClass('enemies')){
		// check draggable enemie for intersection with player
		if(intersection!=null && $(intersection).hasClass('player')){
			// attack player
			attackPlayer(intersection, this.element);
		}
	}
	$(intersection).removeClass('highlight');

	// move draggable to its default position
	if(this.customOptions.moveBack){
		$(this.element).animate({
			left: '0px',
			top: '0px'
		}, toggleDraggableMoving(false));
	}
}

function highlightEnemie (draggable){
	intersection = null;

	// check draggable for intersection with enemie and highlight intersected enemie
	$('#battle .enemies.draggable').each(function (){
		if(intersectionOf(this, draggable)){
			$(this).addClass('highlight');
			intersection = this;
			return;
		}
		else $(this).removeClass('highlight');
	});
}

function highlightPlayer (draggable){
	intersection = null;

	// check draggable for intersection with player and highlight intersected player
	$('#players .player.draggable').each(function (){
		if(intersectionOf(this, draggable)){
			$(this).addClass('highlight');
			intersection = this;
			return;
		}
		else $(this).removeClass('highlight');
	});
}

function intersectionOf (element, draggable){
	var offsetA = element.getBoundingClientRect();
	var widthA = element.offsetWidth;
	var heightA = element.offsetHeight;

	var offsetB = draggable.getBoundingClientRect();
	var widthB = draggable.offsetWidth;
	var heightB = draggable.offsetHeight;

	// check if at least 20px of the draggable are inside the element
	if(offsetA.top > offsetB.top+heightB-20 ||
		offsetA.top+heightA < offsetB.top+20 ||
		offsetA.left > offsetB.left+widthB-20 ||
		offsetA.left+widthA < offsetB.left+20) {
		return false;
	}
	else return true;
}
