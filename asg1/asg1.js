// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL() {
	canvas = document.getElementById('webgl')
	
	gl = canvas.getContext("webgl", { preserveDrawingBuffer: true }); // Magically improves performance.
	if (!gl) {
		console.log("Failed to get web gl context");
		return;
	}
}

function main() {
	setupWebGL();
	connectVariablesToGLSL();
	addActionsForHtmlUI();

	// Register function (event handler) to be called on a mouse press
	canvas.onmousedown = click;
	//canvas.onmousemove = function(ev) { if (ev.buttons == 1) { click(ev); } };
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear the entire canvas to a specific color.
	gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>
	

}



/* Set up global variables that contain data that we will
pass into GLSL */
function connectVariablesToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) { // Initialize shaders
    console.log('Failed to intialize shaders.');
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, 'a_Position'); // Get the storage location of a_Position
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor'); // Get the storage location of u_FragColor
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  
  u_Size = gl.getUniformLocation(gl.program, 'u_Size'); // Get the storage location of u_FragColor
  if (!u_Size) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
}


// Store the location and color of a point. Indexes are associated with points.
//var g_points = [];
//var g_colors = [];
//var g_sizes  = [];

g_shapesList = [];

function click(ev) {
	
	
	let shape;
	if (g_selectedShape == POINT) {
		shape = new Point();
	} else if (g_selectedShape == TRIANGLE) {
		shape = new Triangle();
	} else if (g_selectedShape == CIRCLE) {
		shape = new Circle();
	} else if (g_selectedShape == CUSTOM_TRIANGLE) {
		drawCustomTriangle(ev);
		return;
	}
	
	//shape = new Point();
	let [x, y] = mouseGetPos(ev);
	shape.position = [x, y];
	shape.color = g_selectedColor.slice();
	shape.size = g_selectedSize;
	g_shapesList.push(shape);
	
	renderAllShapes();
}

function mouseGetPos(ev) {
	var x = ev.clientX; // x coordinate of a mouse pointer
	var y = ev.clientY; // y coordinate of a mouse pointer
	var rect = ev.target.getBoundingClientRect();

	x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
	y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
	return([x, y]);
}

function renderAllShapes() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	var len = g_shapesList.length;
	for (var i = 0; i < len; i++) { // Redraw points.
		g_shapesList[i].render();
	}
}



var g_selectedColor = [1, 1, 1, 1];
var g_selectedSize = 5;


var g_selectedShape = 0;
POINT = 0;
TRIANGLE = 1;
CIRCLE = 2;
CUSTOM_TRIANGLE = 3;


function addActionsForHtmlUI() {
	document.getElementById('clearButton').onclick = function () { g_shapesList = []; renderAllShapes(); };
	//document.getElementById('drawPictureButton').onclick = function () { drawPicture(); };
	//document.getElementById('shape_select').addEventListener('change', function () { g_selectedShape = this.value; });
	
	
	
	document.getElementById('pointButton').onclick = function () { g_selectedShape = POINT; };
	document.getElementById('triangleButton').onclick = function () { g_selectedShape = TRIANGLE; };
	document.getElementById('circleButton').onclick = function () { g_selectedShape = CIRCLE; };
	document.getElementById('customTriangleButton').onclick = function () { g_selectedShape = CUSTOM_TRIANGLE; };
	


	
	document.getElementById('redSlider').addEventListener('mouseup',   function () { g_selectedColor[0] = this.value/100; });
	document.getElementById('greenSlider').addEventListener('mouseup', function () { g_selectedColor[1] = this.value/100; });
	document.getElementById('blueSlider').addEventListener('mouseup',  function () { g_selectedColor[2] = this.value/100; });
	document.getElementById('sizeSlider').addEventListener('mouseup',  function () { g_selectedSize = this.value; });
	
}


var verticesList = [];
function drawCustomTriangle(ev) {
	
	let [x,y] = mouseGetPos(ev);
	verticesList.push(x);
	verticesList.push(y);
	
	let len = verticesList.length;
	if (!(len == 6)) {
		for (let i = 0; i < 3; i++) {
			modifiedDrawCircle([x, y]);
		}
		return -1;
	}
	g_shapesList = [];
	
	let shape = new Triangle();
		shape.color = g_selectedColor.slice();
		shape.size = 5;
		g_shapesList.push(shape);
	
	gl.clear(gl.COLOR_BUFFER_BIT);
	g_shapesList[0].render(verticesList);
	
	verticesList = [];
}

function modifiedDrawCircle(pos) {
	let shape = new Circle();
		shape.position = pos;
		shape.color = g_selectedColor.slice();
		shape.size = 2;
		g_shapesList.push(shape);
	
	gl.clear(gl.COLOR_BUFFER_BIT);
	var len = g_shapesList.length;
	for (var i = 0; i < len; i++) { // Redraw points.
		g_shapesList[i].render();
	}
}


function insertTriangle(vertices, color) {
	shape = new Triangle();
	
	shape.color = color;
	g_shapesList.push(shape);
	vertexPosArray.push(vertices);
}


function drawPicture() {
	
	g_shapesList = []; renderAllShapes(); // Clear pre-existing shapes.
	vertexPosArray = [];
	/*
	shape = new Triangle();
		shape.color = [1, 1, 1, 1];
		g_shapesList.push(shape);
		vertexPosArray.push([
			-0.5,-0.75, 0,1, 0.5,-0.75
		]);
	*/
	
	let keystoneVertices = [];
	
	
	bladeMeetHilt_yPos = -0.3
	bladeTaperPos = 0.2;
	bladeTaperSlope = 0.01;
	
	
	let color
	
	color = [0.58, 0.34, 0.21, 1];
	//Handle
	insertTriangle([
		-bladeTaperPos*0.87,bladeMeetHilt_yPos,
		0,1,
		bladeTaperPos*0.87,bladeMeetHilt_yPos,
	], color);
	insertTriangle([
		-bladeTaperPos*0.80,bladeMeetHilt_yPos,
		0,3,
		bladeTaperPos*0.80,bladeMeetHilt_yPos,
	], color);
	
	
	handleMiddlePosOffset = 0.85;
	insertTriangle([
		-bladeTaperPos*0.75,bladeMeetHilt_yPos + handleMiddlePosOffset,
		0,-40,
		bladeTaperPos*0.75,bladeMeetHilt_yPos + handleMiddlePosOffset,
	], color);
	
	insertTriangle([
		-bladeTaperPos*0.75,bladeMeetHilt_yPos + handleMiddlePosOffset,
		0,5,
		bladeTaperPos*0.75,bladeMeetHilt_yPos + handleMiddlePosOffset,
	], color);
	
	
	
	color = [0.8, 0.8, 0.8, 1];
	
	//Blade
	insertTriangle([-(bladeTaperPos + bladeTaperSlope),bladeMeetHilt_yPos, -bladeTaperPos,-1, bladeTaperPos + bladeTaperSlope,bladeMeetHilt_yPos], color);
	insertTriangle([-bladeTaperPos,-1, bladeTaperPos + bladeTaperSlope,bladeMeetHilt_yPos, bladeTaperPos,-1], color);
	
		//Left highlights
	color = [0.85, 0.85, 0.85, 1];
	insertTriangle([-(bladeTaperPos + bladeTaperSlope),bladeMeetHilt_yPos, -bladeTaperPos,-100, 0,bladeMeetHilt_yPos], color);
	color = [1, 1, 1, 1];
	insertTriangle([-(bladeTaperPos + bladeTaperSlope),bladeMeetHilt_yPos, -bladeTaperPos,-100, -(bladeTaperPos + bladeTaperSlope - 0.015),bladeMeetHilt_yPos], color);
	
		//Right highlights
	//color = [0.85, 0.85, 0.85, 1];
	//insertTriangle([(bladeTaperPos + bladeTaperSlope),bladeMeetHilt_yPos, -bladeTaperPos,-100, 0,bladeMeetHilt_yPos], color);
	color = [0.7, 0.7, 0.7, 1];
	insertTriangle([(bladeTaperPos + bladeTaperSlope),bladeMeetHilt_yPos, -bladeTaperPos,-100, (bladeTaperPos + bladeTaperSlope - 0.015),bladeMeetHilt_yPos], color);

	
	
	color = [0.2, 0.2, 0.2, 1];
	hiltHeight = 0.07;
	hiltDroop = -0.05;
	hiltWidth = bladeTaperPos * 3.5;
	//Left hilt
	insertTriangle([-hiltWidth,bladeMeetHilt_yPos+hiltDroop, 0,bladeMeetHilt_yPos+hiltHeight, 0,bladeMeetHilt_yPos], color);
	insertTriangle([-hiltWidth,bladeMeetHilt_yPos+hiltDroop, -hiltWidth,bladeMeetHilt_yPos, 0,bladeMeetHilt_yPos+hiltHeight], color);
	
	//Right hilt
	insertTriangle([hiltWidth,bladeMeetHilt_yPos+hiltDroop, 0,bladeMeetHilt_yPos+hiltHeight, 0,bladeMeetHilt_yPos], color);
	insertTriangle([hiltWidth,bladeMeetHilt_yPos+hiltDroop, hiltWidth,bladeMeetHilt_yPos, 0,bladeMeetHilt_yPos+hiltHeight], color);
	
	//Hilt middle diamond
	insertTriangle([-bladeTaperPos,bladeMeetHilt_yPos, 0,bladeMeetHilt_yPos * 1.1, bladeTaperPos,bladeMeetHilt_yPos], color);
	
	
	
	
	gl.clear(gl.COLOR_BUFFER_BIT);
	let len = g_shapesList.length;
	for (let i = 0; i < len; i++) {
		
		console.log(len);
		g_shapesList[i].render(vertexPosArray[i]);
	}
	g_shapesList = [];
}


