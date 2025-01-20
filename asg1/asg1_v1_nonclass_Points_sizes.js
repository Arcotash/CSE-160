// ColoredPoint.js (c) 2012 matsuda
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
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL() {
	canvas = document.getElementById('webgl');
	
	gl = getWebGLContext(canvas);
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

	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);
}


var g_selectedColor = [1, 1, 1, 1];
var g_selectedSize = 5;
function addActionsForHtmlUI() {
	document.getElementById('redSlider').addEventListener('mouseup',   function () { g_selectedColor[0] = this.value/100; });
	document.getElementById('greenSlider').addEventListener('mouseup', function () { g_selectedColor[1] = this.value/100; });
	document.getElementById('blueSlider').addEventListener('mouseup',  function () { g_selectedColor[2] = this.value/100; });
	document.getElementById('sizeSlider').addEventListener('mouseup',  function () { g_selectedSize = this.value; });
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
var g_points = [];
var g_colors = [];
var g_sizes  = [];

function click_(ev) {
	[x, y] = mouseGetPos(ev);
	g_points.push( [x, y] );
	
	storePointColor();
	
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


function storePointLocation() {
	
	
}

function storePointColor() {
	g_colors.push(g_selectedColor.slice()); // Without the .slice(), we would be pushing a pointer to the list, which is NOT what we want.
	
	/*
	if (x >= 0.0 && y >= 0.0) {      // First quadrant
		g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
	} else if (x < 0.0 && y < 0.0) { // Third quadrant
		g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
	} else {                         // Others
		g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
	}
	*/
}



function click(ev) {
	
  // Store the coordinates to g_points array
  [x, y] = convertCoordinatesEventToGL(ev);
  g_points.push( [x, y] );
  
  
  // Determine color of point based on quadrant.
	  storePointColor();
	  g_sizes.push(g_selectedSize);

	renderAllShapes();
}


function convertCoordinatesEventToGL(ev) {
	var x = ev.clientX; // x coordinate of a mouse pointer
	var y = ev.clientY; // y coordinate of a mouse pointer
	var rect = ev.target.getBoundingClientRect();

	x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
	y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
	return([x, y]);
}


/*  */
function renderAllShapes() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	var len = g_points.length;
	for(var i = 0; i < len; i++) { // Redraw points.
		var xy = g_points[i];
		var rgba = g_colors[i];
		var size = g_sizes[i];

		// Pass the position of a point to a_Position variable
		gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
		// Pass the color of a point to u_FragColor variable
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		// Pass the color of a point to u_FragColor variable
		gl.uniform1f(u_Size, size);
		// Draw a point whose position and color is given by a_Position and u_FragColor respectively.
		gl.drawArrays(gl.POINTS, 0, 1);
	}
}