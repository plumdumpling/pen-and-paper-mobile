var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");;
var selectedColor = {r:0, g:0, b:0, a:255};

// tool variables
var DRAW = "draw", SHADE = "shade", ERASE = "erase";
var tool = DRAW;
var actualWidth, actualHeight;
var currentWidth, currentHeight;

$(document).ready(function (){
	currentWidth = canvas.width;
	currentHeight = canvas.height;
	resizeCanvas();

	// style lines for drawing
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.shadowColor = ctx.strokeStyle;
	ctx.mozImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.msImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;

	// set up for basic draw tool
	ctx.lineWidth = 2;
	ctx.shadowBlur = 1;
	ctx.strokeStyle = "rgb(0,0,0)";
	ctx.globalCompositeOperation = "source-over";

	// eventlisteners for touch based drawing
	canvas.addEventListener("touchstart", recognizeEvent, false);
	canvas.addEventListener("touchmove", recognizeEvent, false);
	document.body.addEventListener("touchend", recognizeEvent, false);

	// eventlisteners for mouse based drawing
	canvas.addEventListener("mousedown", recognizeEvent, false);
	canvas.addEventListener("mousemove", recognizeEvent, false);
	document.body.addEventListener("mouseup", recognizeEvent, false);
});

function resizeCanvas (){
	// scale canvas size to canvas size on screen
	actualWidth = $('#canvas').width();
	actualHeight = $('#canvas').height();
	ctx.scale(currentWidth/actualWidth, currentHeight/actualHeight);
	// update current size
	currentWidth = actualWidth;
	currentHeight = actualHeight;
}

/* EVENT LISTENER */

function recognizeEvent (event){
	// error handling - return function on click outside of canvas
	if(event.target !== canvas) return;

	// get click/touch position
	var eventX, eventY;
	if(event.type == "touchstart" || event.type == "touchmove" || event.type == "touchend"){
		// for touch
		event.preventDefault();
		eventX = event.targetTouches[0].pageX - $(canvas).parent().offset().left - canvas.offsetLeft;
		eventY = event.targetTouches[0].pageY - $(canvas).parent().offset().top;
	}
	else{
		// for mouse
		eventX = event.pageX - $(canvas).parent().offset().left - canvas.offsetLeft;
		eventY = event.pageY - $(canvas).parent().offset().top;
	}

	// check which action was made
	if(event.type === "mousedown" || event.type === "touchstart") onStart(eventX, eventY);
	else if(event.type === "mousemove" || event.type === "touchmove") onMove(eventX, eventY);
	else if(event.type === "mouseup" || event.type === "touchend") onEnd(eventX, eventY);
}


/* DRAWING FUNCTIONS */

var drawing = false, moved = false;
var points = [];

function onStart (eventX, eventY){
	drawing = true;
	moved = false;

	// add current point to array for shading tool
	if(tool === SHADE) points.push({x:eventX, y:eventY});

	// start new line
	ctx.beginPath();
	ctx.moveTo(eventX, eventY);

	// save position for undo and redo functions
	currentLine.push({x:eventX, y:eventY});
	// clear redo array and disable redo button - not able to redo after draw something new
	redoLines = [];
	$('#redo').attr('disabled', true);
}

function onMove (eventX, eventY){
	if(!drawing) return;
	// remember the mouse/finger was moved
	moved = true;

	if(tool === SHADE) shading(eventX, eventY, $('#lineWidth').val());

	// move the brush
	ctx.lineTo(eventX, eventY);
	ctx.stroke();

	// save position for undo and redo functions
	currentLine.push({x:eventX, y:eventY});
}

function onEnd (eventX, eventY){
	if(!drawing) return;

	// draw a circle if the touch/click position didn't change since start
	if(!moved){
		ctx.arc(eventX, eventY, ctx.lineWidth/4, 0, 2*Math.PI, false);
		ctx.stroke();
	}

	// clear points array for shading tool if line ends
	if(tool === SHADE) points = [];

	// end line
	drawing = false;
	ctx.closePath();

	// save position for undo and redo functions
	currentLine.push({x:eventX, y:eventY});
	// save drawn line and clear current line before drawing the next one
	undoLines.push({line:currentLine, tool:tool, width:ctx.lineWidth, color:selectedColor, shadingSize:$('#lineWidth').val()});
	currentLine = [];
	// enable undo button
	$('#undo').attr('disabled', false);
}


/* ADD SHADING LINES */

function shading (eventX, eventY, shadingSize){
	// add current point to array for shading tool
	points.push({x:eventX, y:eventY});
	// get current point as object
	var currentPoint = points[points.length-1];

	for(var i=0; i<points.length; i++){
		// get distance between current point and other points in line
		dx = points[i].x - currentPoint.x;
		dy = points[i].y - currentPoint.y;
		// according to the pythagorean theorem "d" is the squared distance between the two points
		// a^2 + b^2 = c^2  =>  dx = a, dy = b, d = c^2
		d = dx * dx + dy * dy;

		// check if the distance between the two points is smaller than 100 => 100^2=1000
		if(d < shadingSize*300){
			// draw a line between the two points with a bit of offset
			ctx.beginPath();
			ctx.strokeStyle = 'rgba('+selectedColor.r+','+selectedColor.g+','+selectedColor.b+',0.3)';
			ctx.moveTo(currentPoint.x + (dx * 0.1), currentPoint.y + (dy * 0.1));
			ctx.lineTo(points[i].x - (dx * 0.1), points[i].y - (dy * 0.1));
			ctx.stroke();
		}
  }
  // set stroke color back to selected color
	ctx.strokeStyle = 'rgb('+selectedColor.r+','+selectedColor.g+','+selectedColor.b+')';
}


/* UNDO & REDO */

var undoLines = [], redoLines = [], currentLine = [];

function undo (){
	if(undoLines.length<=0) return;

	// move last line from undo to redo array
	redoLines.unshift(undoLines.pop());
	// disable undo button, if there is nothing to undo - enable redo button
	if(undoLines.length<=0) $('#undo').attr('disabled', true);
	$('#redo').attr('disabled', false);

	// clear canvas before redrawing
	ctx.clearRect(0, 0, actualWidth, actualHeight);

	// redraw all lines
	for(var n=0; n<undoLines.length; n++){
		drawLine(undoLines[n].line, undoLines[n].tool, undoLines[n].width, undoLines[n].color, undoLines[n].shadingSize);
	}

	// reset styles
	styleForTool();
}

function redo (){
	if(redoLines.length<=0) return;

	// redraw the line
	drawLine(redoLines[0].line, redoLines[0].tool, redoLines[0].width, redoLines[0].color, redoLines[0].shadingSize);

	// reset styles
	styleForTool();

	// move next line from redo to undo array
	undoLines.push(redoLines.shift());
	// disable redo button, if there is nothing to redo - enable undo button
	if(redoLines.length<=0) $('#redo').attr('disabled', true);
	$('#undo').attr('disabled', false);
}

function drawLine (line, tool, lineWidth, color, shadingSize){
	// set line styles
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = 'rgb('+color.r+','+color.g+','+color.b+')';
	ctx.shadowColor = ctx.strokeStyle;
	selectedColor = color;

	if(tool === DRAW){
		ctx.shadowBlur = 1;
		ctx.globalCompositeOperation = "source-over";
	}
	else if(tool === SHADE){
		ctx.shadowBlur = 0;
		ctx.globalCompositeOperation = "source-over";
	}
	else if(tool === ERASE){
		ctx.shadowBlur = 0;
		ctx.globalCompositeOperation = "destination-out";
	}

	// start drawing the line
	if(tool === SHADE) points.push({x:line[0].x, y:line[0].y});
	ctx.beginPath();
	ctx.moveTo(line[0].x, line[0].y);

	// move the brush
	for(var i=1; i<line.length; i++){
		if(tool === SHADE) shading(line[i].x, line[i].y, shadingSize);
		ctx.lineTo(line[i].x, line[i].y);
		ctx.stroke();
	}

	// end line
	if(tool === SHADE) points = [];
	ctx.closePath();
}


/* COLOR & TOOL SELECTION */

$('.colorBtn').click(function (){
	if(!$(this).attr('disabled')){
		// style tool with selected color
		ctx.strokeStyle = this.style.borderColor;
		ctx.shadowColor = ctx.strokeStyle;

		// remember selected color
		var selectedColorArray = this.style.borderColor.replace(/[^\d,]/g, '').split(',');
		selectedColor = {r:selectedColorArray[0], g:selectedColorArray[1], b:selectedColorArray[2], a:255};

		// style color palette buttons
		$('.colorBtn').css('background-color', 'rgba(255,255,255,0)');
		$(this).css('background-color', this.style.borderColor);

		$('.colorBtn').attr('disabled', false);
		$(this).attr('disabled', true);
	}
});

function toggleTool (sender){
	// disable button of activated tool
	$('button[name=tool]').each(function (){
		$(this).attr('disabled', false);
	});
	$(sender).attr('disabled', true);

	tool = $(sender).val();
	styleForTool();
}

function styleForTool (){
	switch(tool){
		case DRAW:
			// set styles for drawing tool
			ctx.lineWidth = $('#lineWidth').val();
			ctx.shadowBlur = 1;
			ctx.globalCompositeOperation = "source-over";
			break;
		case SHADE:
			// set styles for shading tool
			ctx.lineWidth = 1;
			ctx.shadowBlur = 0;
			ctx.globalCompositeOperation = "source-over";
			break;
		case ERASE:
			// set styles for erasing tool
			ctx.lineWidth = $('#lineWidth').val();
			ctx.shadowBlur = 0;
			ctx.globalCompositeOperation = "destination-out";
			break;
	}

	$('.colorBtn:disabled').each(function (){
		var selectedColorArray = this.style.borderColor.replace(/[^\d,]/g, '').split(',');
		selectedColor = {r:selectedColorArray[0], g:selectedColorArray[1], b:selectedColorArray[2], a:255};
	});

	ctx.strokeStyle = 'rgb('+selectedColor.r+','+selectedColor.g+','+selectedColor.b+')';
	ctx.shadowColor = ctx.strokeStyle;
}

// change brush size
$("input[type=range]").on('change input', function(){
	console.log($('#lineWidth').val());
	if(tool !== SHADE) ctx.lineWidth = $('#lineWidth').val();
});


/* DELETE ALL */

function clearCanvas (){
	// clear canvas
	ctx.clearRect(0, 0, actualWidth, actualHeight);
	// clear undo and redo arrays and disable the buttons
	undoLines = [];
	redoLines = [];
	$('#undo').attr('disabled', true);
	$('#redo').attr('disabled', true);
}
