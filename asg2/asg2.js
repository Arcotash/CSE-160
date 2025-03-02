// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }
 `

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }
`

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL() {
	canvas = document.getElementById('webgl');
	
	gl = canvas.getContext("webgl", { preserveDrawingBuffer: true }); // Magically improves performance.
	if (!gl) {
		console.log("Failed to get the rendering context for WebGL");
		return;
	}
	
	gl.enable(gl.DEPTH_TEST);
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
  
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix'); 
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
  
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix'); 
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
  
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  
  
}

var g_horizontalAngle = 90;


var g_leftArmAngle = 0;

var g_yellowAnimation = 1;
var g_goldBarAngleOffset = -10;


var g_isAnimated = true;

function addActionsForHtmlUI() {	
	document.getElementById('horizontalAngleSlider').addEventListener('mousemove',  function () { g_horizontalAngle = this.value; renderScene(); });
	
	document.getElementById('angleLeftArm').addEventListener('mousemove',  function () { g_leftArmAngle = this.value; renderScene(); });
	document.getElementById('angleGoldBar').addEventListener('mousemove',  function () { g_goldBarAngleOffset = this.value; renderScene(); });
	

	
	document.getElementById('animationOnButton').onclick = function () { g_isAnimated = true; };
	document.getElementById('animationOffButton').onclick = function () { g_isAnimated = false; };
	
}




function main() {
	setupWebGL();
	connectVariablesToGLSL();
	addActionsForHtmlUI();

	// Register function (event handler) to be called on a mouse press
	//canvas.onmousemove = function(ev) { if (ev.buttons == 1) { click(ev); } };
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear the entire canvas to a specific color.
	
	requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.;
var g_seconds = performance.now()/1000. - g_startTime;

function tick() {
	g_seconds = performance.now()/1000. - g_startTime;
	//console.log(performance.now());
	
	renderScene();
	
	requestAnimationFrame(tick);
}

var g_secondsOnOff = 0;

function updateAnimationAngles() {
	if (g_isAnimated) {
		g_leftArmAngle = (25*Math.sin(g_seconds));
		document.getElementById("angleLeftArm").value = g_leftArmAngle;
		g_secondsOnOff = g_seconds;
	}
}



function sendTextToHTML(text, htmlID) {
	var htmlElm = document.getElementById(htmlID);
	if (!htmlElm) {
		console.log("Failed to get " + htmlID + " from HTML");
		return;
	}
	htmlElm.innerHTML = text;
}


/*
Useful to have all of our drawing in a single function. 
E.g., to update the scene when we move the slider, we just call renderAllShapes().

Instructor: Most bugs he's seen is from drawing logic being spread in many functions.
*/
function renderScene() {
	var startTime = performance.now();
	updateAnimationAngles();
	
	
	// Pass the matrix to u_ModelMatrix attribute
	var globalRotMat = new Matrix4().rotate(g_horizontalAngle, 0, 1, 0);
	gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
	
	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Draw a test triangle
	//drawTriangle3D( [-1.,0.,0.,  -0.5,-1.,0.,  0.,0.,0.] );
	
	/*
	// Draw a cube
	var body = new Cube();
		body.color = [1.,0.,0.,1.];
		body.matrix.translate(-.25, -.75, 0.);
		body.matrix.rotate(-5, 1, 0, 0);
		body.matrix.scale(0.5, .3, .5);
		body.render();
	
	var leftArm = new Cube();
		leftArm.color = [1, 1, 0, 1];
		leftArm.matrix.setTranslate(0., -.5, 0.);
		leftArm.matrix.rotate(-g_yellowAngle, 0, 0, 1);
		//leftArm.matrix.rotate(45*Math.sin(g_seconds), 0, 0, 1);
		var leftArmCoordinatesMatrix = new Matrix4(leftArm.matrix);
		leftArm.matrix.scale(.25, .7, .5);
		leftArm.matrix.translate(-.5, 0, 0);
		leftArm.render();
	
	var box = new Cube();
		box.color = [1, 0, 1, 1];
		box.matrix = leftArmCoordinatesMatrix;
		box.matrix.translate(0, 0.65, 0);
		box.matrix.rotate(g_magentaAngle, 0, 0, 1);
		box.matrix.scale(.3, .3, .3);
		box.matrix.translate(-.5, 0, -0.001);
		box.render();
	*/
	
	
	
	var baseCube = new Cube();
	
	//baseCube.matrix.scale(.3, .3, .3);
	var baseCubeCoordinatesMatrix = baseCube.matrix;
	baseCube.matrix.scale(.8, .8, .8);
	//baseCubeCoordinatesMatrix.rotate(g_seconds * 100, 0, 0);
	
	
	//drawSnake(baseCubeCoordinatesMatrix);
	
	//dancingBox(baseCubeCoordinatesMatrix);
	drawManekiNeko(baseCubeCoordinatesMatrix);
	
	
	
	var duration = performance.now() - startTime;
	sendTextToHTML( " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "numdot");
	
}


var g_camera = new Camera();
g_camera.moveLeft();

function drawManekiNeko(baseCubeCoordinatesMatrix) {
	var translateValues = [-0.5, -.5, 0];
	//baseCubeCoordinatesMatrixCopy.translate(translateValues[0], translateValues[1], translateValues[2]);
	
	
	var Body = new Cube();
		Body.matrix = new Matrix4(baseCubeCoordinatesMatrix);
		Body.matrix.translate(-0.33, -.25, -0.425);
		Body.matrix.scale(.6, .75, 0.75);
		Body.matrix.translate(-.5, -.5, 0);
		Body.render();
	
	var Head = new Cube();
		Head.color = [1, 1, 1, 1];
		Head.matrix = new Matrix4(Body.matrix);
		Head.matrix.translate(0, 1, 0);
		Head.render();
	
	var Scarf = new Cube();
		Scarf.color = [1, 0, 0, 1];
		Scarf.matrix = new Matrix4(Body.matrix);
		Scarf.matrix.scale(1.02, 0.2, 1.02);
		Scarf.matrix.translate(-0.01, 5, -0.01);
		Scarf.render();
	
	var goldBell = new Cube();
		goldBell.matrix = new Matrix4(Body.matrix);
		goldBell.color = [1, 1, 0, 1];
		goldBell.matrix.scale(.3, .3, .3);
		goldBell.matrix.translate(2.7, 3.1, 1.15);
		goldBell.render();
	
	// SQUINTING EYES
	var leftEye = new Cube();
		leftEye.color = [0, 0, 0, 1];
		leftEye.matrix = new Matrix4(Body.matrix);
		
		leftEye.matrix.translate(0.72, 1.75, 0.1);
		leftEye.matrix.scale(.3, .05, .3);
		leftEye.render();
	
	var rightEye = new Cube();
		rightEye.color = [0, 0, 0, 1];
		rightEye.matrix = new Matrix4(Body.matrix);
		
		rightEye.matrix.translate(0.72, 1.75, 0.6);
		rightEye.matrix.scale(.3, .05, .3);
		rightEye.render();
	
	
	// WHISKERS
		// LEFT WHISKERS
			var leftWhiskerTop = new Cube();
				leftWhiskerTop.color = [0.2, .2, .2, 1];
				leftWhiskerTop.matrix = new Matrix4(Body.matrix);
				
				leftWhiskerTop.matrix.translate(.72, 1.5, 0);
				leftWhiskerTop.matrix.scale(.3, .015, .3);
				leftWhiskerTop.render();
			
			var leftWhiskerMiddle = new Cube();
				leftWhiskerMiddle.color = [0.2, .2, .2, 1];
				leftWhiskerMiddle.matrix = new Matrix4(Body.matrix);
				
				leftWhiskerMiddle.matrix.translate(.72, 1.47, 0);
				leftWhiskerMiddle.matrix.scale(.3, .015, .3);
				leftWhiskerMiddle.render();
			
			var leftWhiskerBottom = new Cube();
				leftWhiskerBottom.color = [0.2, .2, .2, 1];
				leftWhiskerBottom.matrix = new Matrix4(Body.matrix);
				
				leftWhiskerBottom.matrix.translate(.72, 1.44, 0);
				leftWhiskerBottom.matrix.scale(.3, .015, .3);
				leftWhiskerBottom.render();
		
		//RIGHT WHISKERS
			var rightWhiskerTop = new Cube();
				rightWhiskerTop.color = [0.2, .2, .2, 1];
				rightWhiskerTop.matrix = new Matrix4(Body.matrix);
				
				rightWhiskerTop.matrix.translate(.72, 1.5, 0.699);
				rightWhiskerTop.matrix.scale(.3, .015, .3);
				rightWhiskerTop.render();
			
			var rightWhiskerMiddle = new Cube();
				rightWhiskerMiddle.color = [0.2, .2, .2, 1];
				rightWhiskerMiddle.matrix = new Matrix4(Body.matrix);
				
				rightWhiskerMiddle.matrix.translate(.72, 1.47,0.699);
				rightWhiskerMiddle.matrix.scale(.3, .015, .3);
				rightWhiskerMiddle.render();
			
			var rightWhiskerBottom = new Cube();
				rightWhiskerBottom.color = [0.2, .2, .2, 1];
				rightWhiskerBottom.matrix = new Matrix4(Body.matrix);
				
				rightWhiskerBottom.matrix.translate(.72, 1.44, 0.699);
				rightWhiskerBottom.matrix.scale(.3, .015, .3);
				rightWhiskerBottom.render();
	
	
	// RIGHT EAR
		var rightInnerEar = new Cube();
			rightInnerEar.color = [1, 0, 0, 1];
			rightInnerEar.matrix = new Matrix4(Body.matrix);
			
			rightInnerEar.matrix.translate(0.01, 2, 0);
			rightInnerEar.matrix.scale(.3, .3, .3);
			rightInnerEar.render();
		
		var rightOuterEar = new Cube();
			rightOuterEar.color = [1, 1, 1, 1];
			rightOuterEar.matrix = new Matrix4(Body.matrix);
			
			rightOuterEar.matrix.translate(0, 2, -0.025);
			rightOuterEar.matrix.scale(.3, .33, .35);
			rightOuterEar.render();
	
	// LEFT EAR
		var leftInnerEar = new Cube();
			leftInnerEar.color = [1, 0, 0, 1];
			leftInnerEar.matrix = new Matrix4(Body.matrix);
			
			leftInnerEar.matrix.translate(0.01, 2, 0.7);
			leftInnerEar.matrix.scale(.3, .3, .3);
			leftInnerEar.render();
		
		var leftOuterEar = new Cube();
			leftOuterEar.color = [1, 1, 1, 1];
			leftOuterEar.matrix = new Matrix4(Body.matrix);
			
			leftOuterEar.matrix.translate(0, 2, 0.675);
			leftOuterEar.matrix.scale(.3, .33, .35);
			leftOuterEar.render();
	
	
	// LEFT ARM
		var leftArm = new Cube();
			leftArm.color = [1, 1, 1, 1];
			//leftArm.matrix = new Matrix4(baseCubeCoordinatesMatrix);
			//leftArm.matrix.translate(-.5, 0, 0);
			
			//leftArm.matrix.translate(-.4, 0, 0.29);
			leftArm.matrix.translate(-.3, 0, 0.29);
			leftArm.matrix.rotate((g_leftArmAngle - 25), 0, 0, 1);
			leftArm.matrix.translate(-.1,0,0); // Comment out if too troublesome.
			leftArm.matrix.scale(0.25, 0.75, .25);
			leftArm.matrix.scale(0.8, 0.8, .8); // Scalefactor
			
			leftArm.render();
		
		var leftPaw = new Cube();
			leftPaw.color = [1, 1, 1, 1];
			leftPaw.matrix = new Matrix4(leftArm.matrix);
			leftPaw.matrix.scale(1.33, 0.5, 1.33);
			leftPaw.matrix.translate(0, 1.5, -0.12);
			
			leftPaw.render();
		
		var heldGold = new Cube();
		// /*
			heldGold.matrix = new Matrix4(leftPaw.matrix);
			heldGold.color = [1, 1, 0, 1];
			

			heldGold.matrix.rotate(-25*Math.sin(g_secondsOnOff) + 25, 0, 0, 1);
			
			heldGold.matrix.scale(0.2, 2, 0.99);
			heldGold.matrix.translate(2.5 + 0.9*Math.sin(g_secondsOnOff), -1.1 + 0.2*Math.sin(g_secondsOnOff), 0.005);
			
			//heldGold.matrix.scale(1.33, 0.5, 1.33);
			//heldGold.matrix.rotate(g_goldBarAngleOffset, 0, 0, 1);
			//heldGold.matrix.scale(0.75, 2, 0.75);
			heldGold.render();
		// */
		/*
			heldGold.matrix = new Matrix4(leftArm.matrix);
			heldGold.color = [1, 0, 0, 1];
			heldGold.matrix.rotate(-45*Math.sin(g_seconds) + 45, 0, 0, 1);
			heldGold.render();
		*/
	
	// RIGHT ARM
		var rightArm = new Cube();
			rightArm.color = [1, 1, 1, 1];
			//leftArm.matrix = new Matrix4(baseCubeCoordinatesMatrix);
			//leftArm.matrix.translate(-.5, 0, 0);
			
			//leftArm.matrix.translate(-.4, 0, 0.29);
			rightArm.matrix.translate(-.3, 0, -0.55);
			rightArm.matrix.rotate(-110, 0, 0, 1);
			rightArm.matrix.translate(-.1,0,0); // Comment out if too troublesome.
			rightArm.matrix.scale(0.25, 0.75, .25);
			rightArm.matrix.scale(0.8, 0.8, .8); // Scalefactor
			
			rightArm.render();
	
	// LEGS
		// LEFT LEG
			var leftLeg = new Cube();
			leftLeg.color = [.9, .9, .9, 1];
				leftLeg.matrix = new Matrix4(Body.matrix);
				leftLeg.matrix.translate(0, 0, -0.2);
				leftLeg.matrix.scale(1, 0.5, 0.2);
				leftLeg.render();
			
			var rightLeg = new Cube();
			rightLeg.color = [.9, .9, .9, 1];
				rightLeg.matrix = new Matrix4(Body.matrix);
				rightLeg.matrix.translate(0, 0, 1);
				rightLeg.matrix.scale(1, 0.5, 0.2);
				rightLeg.render();
	
	//TAIL
		var tailSegment1 = new Cube();
			tailSegment1.color = [0.95, 0.95, 0.95, 1];
			tailSegment1.matrix.translate(-.6, -0.45, -0.1);
			
			tailSegment1.matrix.rotate(45*Math.sin(g_secondsOnOff * 2), 10, 0, 0.5);
			
			tailSegment1.matrix.scale(0.25, 0.5, .25);
			tailSegment1.matrix.scale(0.5, 0.5, .5); // Scalefactor
			tailSegment1.matrix.translate(0, 0, -.5);
			
			
			tailSegment1.render();
		
		var tailSegment2 = new Cube();
			tailSegment2.color = [0.95, 0.95, 0.95, 1];
			tailSegment2.matrix = tailSegment1.matrix;
			tailSegment2.matrix.translate(0, 0.9, 0.5); // Move to proper location after offset rotation.
			tailSegment2.matrix.scale(4, 2, 4); // Shear prevention pt.2
			tailSegment2.matrix.rotate(5*Math.sin(g_secondsOnOff * 2)-g_goldBarAngleOffset, 10, 0, 0.5);
			tailSegment2.matrix.scale(0.25, 0.5, .25); // Shear prevention pt.1
			tailSegment2.matrix.translate(0, 0, -.5); // Offset rotation.
			
			tailSegment2.render();
		
		
		var tailSegment3 = new Cube();
			tailSegment3.color = [0.95, 0.95, 0.95, 1];
			tailSegment3.matrix = tailSegment2.matrix;
			tailSegment3.matrix.translate(0, 0.9, 0.5); // Move to proper location after offset rotation.
			tailSegment3.matrix.scale(4, 2, 4); // Shear prevention pt.2
			tailSegment3.matrix.rotate(5*Math.sin(g_secondsOnOff * 2), 10, 0, 0.5);
			tailSegment3.matrix.scale(0.25, 0.5, .25); // Shear prevention pt.1
			tailSegment3.matrix.translate(0, 0, -.5); // Offset rotation.
			
			tailSegment3.render();
		
		var tailSegment4 = new Cube();
			tailSegment4.color = [0.95, 0.95, 0.95, 1];
			tailSegment4.matrix = tailSegment2.matrix;
			tailSegment4.matrix.translate(0, 0.9, 0.5); // Move to proper location after offset rotation.
			tailSegment4.matrix.scale(4, 2, 4); // Shear prevention pt.2
			tailSegment4.matrix.rotate(10*Math.sin(g_secondsOnOff * 2), 10, 0, 0.5);
			tailSegment4.matrix.scale(0.25, 0.5, .25); // Shear prevention pt.1
			tailSegment4.matrix.translate(0, 0, -.5); // Offset rotation.
			
			tailSegment4.render();
		
		/*
		var tailSegment2 = new Cube();
			tailSegment2.color = [1, 0, 0, 1];
			tailSegment2.matrix.translate(-.6, -.17 + 0.06*Math.cos(g_seconds*2), -0.1 + 0.23*Math.sin(g_seconds));
			
			tailSegment2.matrix.rotate(45*Math.sin(g_seconds), 10, 0, 0.5);
			
			tailSegment2.matrix.scale(0.25, 0.75, .25);
			tailSegment2.matrix.scale(0.5, 0.5, .5); // Scalefactor
			tailSegment2.matrix.translate(0, 0, -.5);
			
			tailSegment2.render();
		*/
		
		/*
		var tailSegment2 = new Cube();
			tailSegment2.matrix = tailSegment1.matrix;
			tailSegment1.matrix.translate(0, 1, 0);
			tailSegment1.matrix.rotate(45*Math.sin(g_seconds), 10, 0, 0.5);
			
			tailSegment2.render();
		*/
	
}


/*
function drawCube(matrix) {
	var newCube = new Cube();
	newCube.matrix = matrix;
	newCube.render();
}





function drawSnakeBox(baseCubeCoordinatesMatrix, delay){
	var box = new Cube();
	box.matrix.translate(45*Math.sin((g_seconds + delay)/2)/100, -45*Math.cos(g_seconds + delay)/300 , 0);
	box.matrix.rotate(g_yellowAngle, 0, 0, 1);
	
	box.matrix.scale(.1, .1, .1);
	box.render();
	
}

function drawSnake(baseCubeCoordinatesMatrix) {
	drawSnakeBox(baseCubeCoordinatesMatrix, 0);
	drawSnakeBox(baseCubeCoordinatesMatrix, 1);
}

function dancingBox(baseCubeCoordinatesMatrix) {
	var box = new Cube();
	box.matrix = baseCubeCoordinatesMatrix;
	
	box.matrix.translate(Math.sin(g_seconds)/2, 0, Math.cos(g_seconds)/2);
	box.matrix.rotate(g_seconds * 100, 0, 0, 1);
	box.matrix.translate(-0.05, -0.05, 0);
	box.matrix.scale(.1, .1, .1);
	
	box.render();
}
*/




// Store the location and color of a point. Indexes are associated with points.
//var g_points = [];
//var g_colors = [];
//var g_sizes  = [];



function mouseGetPos(ev) { // convertCoordinatesEventToGL
	var x = ev.clientX; // x coordinate of a mouse pointer
	var y = ev.clientY; // y coordinate of a mouse pointer
	var rect = ev.target.getBoundingClientRect();

	x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
	y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
	return([x, y]);
}
