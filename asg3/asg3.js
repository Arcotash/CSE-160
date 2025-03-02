// Vertex shader program


var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;

  attribute vec2 a_UV;
  varying vec2 v_UV;

  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }
 `

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;


  uniform int u_whichTexture;

  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;

  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;

    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1., 1.);
    
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);

    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);

    } else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);

    } else if (u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler3, v_UV);

    } else if (u_whichTexture == 4) {
      gl_FragColor = texture2D(u_Sampler4, v_UV);
    }
  }
`

let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_whichTexture;
let u_Sampler0;

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

function checkStorage(variable, variableName) {
  if (variable < 0) {
    throw('Failed to get the storage location of ' + variableName);
  }
}

function connectVariablesToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) { // Initialize shaders
    console.log('Failed to intialize shaders.');
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, 'a_Position'); // Get the storage location of a_Position
  if (a_Position < 0) { throw('Failed to get the storage location of a_Position'); }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV'); // Get the storage location of a_Position
  if (a_UV < 0) { throw('Failed to get the storage location of a_UV'); }
  
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor'); // Get the storage location of u_FragColor
  if (u_FragColor < 0) { throw('Failed to get the storage location of u_FragColor'); }
  
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix'); 
  if (u_ModelMatrix < 0) { throw('Failed to get the storage location of u_ModelMatrix'); }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix'); 
  if (u_GlobalRotateMatrix < 0) { throw('Failed to get the storage location of u_GlobalRotateMatrix'); }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix'); 
  if (u_ViewMatrix < 0) { throw('Failed to get the storage location of u_ViewMatrix'); }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix'); 
  if (u_ProjectionMatrix < 0) { throw('Failed to get the storage location of u_ProjectionMatrix'); }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (u_whichTexture < 0) { throw('Failed to get the storage location of u_whichTexture'); }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (u_Sampler0 < 0) { throw('Failed to get the storage location of u_Sampler0'); }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (u_Sampler1 < 0) { throw('Failed to get the storage location of u_Sampler1'); }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (u_Sampler2 < 0) { throw('Failed to get the storage location of u_Sampler2'); }

  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (u_Sampler3 < 0) { throw('Failed to get the storage location of u_Sampler3'); }

  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (u_Sampler4 < 0) { throw('Failed to get the storage location of u_Sampler4'); }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  
  
}

var g_horizontalAngle = 90;


var g_leftArmAngle = 0;

var g_yellowAnimation = 1;
var g_goldBarAngleOffset = -10;


var g_isAnimated = true;

function addActionsForHtmlUI() {	
	
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


  initTextures("textures/sky.jpg", gl.TEXTURE0, u_Sampler0, 0);
  initTextures("textures/ground_sand.jpg", gl.TEXTURE1, u_Sampler1, 1);
  initTextures("textures/brick_wall.jpg", gl.TEXTURE2, u_Sampler2, 2);
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set the values to reset the color buffer to when gl.clear() is called.
	
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




var g_map = [
  [
    [1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 1, 1,   1, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 1, 0,   0, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 0,   0, 1, 1, 1,   1, 1, 1, 1,   1, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 1, 0, 0,   1, 1, 1, 1,   1, 1, 1, 0,   0, 1, 1, 1,   1, 1, 1, 1,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 0,   0, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1],

  ],
  [
    [1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 1, 1,   1, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 1, 0,   0, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 1, 0,   0, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 1, 0,   0, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 0,   0, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1],

  ],
  [
    [1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 0, 1,   1, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 0, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1],

  ],
  [
    [1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 0, 1,   1, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 1, 1,   1, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 1, 1,   1, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 0, 1,   1, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 1, 1, 1,   1, 1, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 1, 1,   1, 0, 1, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],

    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 1],
    [1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1,   1, 1, 1, 1],

  ],

];

function drawMap() {
	var body = new Cube();
  var cubeLength = 1.5;
  let height = g_map.length;
  let length = g_map[0].length;
  let width = g_map[0][0].length;
	for (z=0; z<height; z++) {
  
		for (x=0; x<length; x++) {
			for (y=0; y<width; y++) {
        if (g_map[z][x][y] == 1) {
          if (deleteQueued) {
            g_map[z][x][y] = 0;

          }

          body.textureNum = 2;
          body.matrix.setTranslate(0, -cubeLength, 0);
          body.matrix.scale(cubeLength, cubeLength, cubeLength);
          body.matrix.translate(x-(length/2), 0.66 + z, y-(width/2));
          body.render();
        }
			}
		}
	}
}


var deleteQueued = false;
var queuedRay;


function deleteCube() {
  var dist_normed = new Vector3().set(this.at).sub(this.eye).normalize();
  queuedRay = dist_normed.mul(200);

}


/*
Useful to have all of our drawing in a single function. 
E.g., to update the scene when we move the slider, we just call renderAllShapes().

Instructor: Most bugs he's seen is from drawing logic being spread in many functions.
*/

g_camera = new Camera();

function renderScene() {
  //g_camera.rotateBy(0, 10);
  document.onkeydown = function (ev) { keypressHandler(ev, true); };
  document.onkeyup = function (ev) { keypressHandler(ev, false); };
  document.onmousedown = function (ev) { mouseDownHandler(ev); };
  document.onmousemove = function (ev) { mouseMoveHandler(ev); };
  document.onmouseup = function (ev) { mouseUpHandler(ev); };
  inputHandler();
	var startTime = performance.now();
	updateAnimationAngles();
	

  // Camera logic
    var projMat =      new Matrix4();
    var viewMat =      new Matrix4();
    var globalRotMat = new Matrix4(); //.rotate(g_horizontalAngle, 0, 1, 0);

    projMat.setPerspective(60, canvas.width/canvas.height, 0.001, 1000);
    viewMat.setLookAt(
      g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2], 
      g_camera.at.elements[0] , g_camera.at.elements[1] , g_camera.at.elements[2] ,
      g_camera.up.elements[0] , g_camera.up.elements[1] , g_camera.up.elements[2]
    );

    gl.uniformMatrix4fv(u_ProjectionMatrix,   false, projMat.elements);
    gl.uniformMatrix4fv(u_ViewMatrix,         false, viewMat.elements);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
	

	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear <canvas>

	var baseCube = new Cube();
	var baseCubeCoordinatesMatrix = baseCube.matrix;
  baseCube.matrix.translate(-10,0,0);
	baseCube.matrix.scale(.8, .8, .8);
	drawManekiNeko(baseCubeCoordinatesMatrix);
	
  drawMap();
  createGround();
  createSky();

  /*

var dist_normed = new Vector3().set(g_camera.at).sub(g_camera.eye).normalize();
  var theta = Math.atan(dist_normed.elements[1], dist_normed.elements[2])
  var phi = Math.atan(dist_normed.elements[1], dist_normed.elements[0])
	

  
  var ray = new Cube();
  ray.matrix.translate(g_camera.eye.elements[0], g_camera.eye.elements[1] - 0.2, g_camera.eye.elements[2]);
  ray.matrix.scale(0.1, 0.1, -100);
  ray.matrix.rotate(-theta, 1, 0, 0);
  ray.matrix.rotate(-phi, 0, 0, 1);
  ray.render();


  */
  
	var duration = performance.now() - startTime;
	sendTextToHTML( " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "numdot");
	
}

function createSky() {
  var Sky = new Cube();
    Sky.color = [1, 1, 1, 1];
    Sky.matrix = new Matrix4();
    //Sky.matrix.translate(0, 0.25, 0);
    //Sky.matrix.rotate(180, 0, 0, 1);
    
    Sky.matrix.scale(500, 40, 500);
    Sky.matrix.translate(-0.5, -0.5, -0.5);
    
    //Sky.matrix.translate(-0.5, 0, -0.5);
    
    Sky.textureNum = 0;

    Sky.render();
}




function createGround() {
  var Ground = new Cube();
    Ground.color = [1, 1, 1, 1];
    Ground.matrix = new Matrix4();
    Ground.matrix.translate(0, -0.5, 0);
    Ground.matrix.rotate(180, 0, 0, 1);
    Ground.matrix.scale(48, 1, 48);
    Ground.matrix.translate(-0.5, 0, -0.5);
    
    Ground.textureNum = 1;

    Ground.render();
}


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
      leftArm.matrix = new Matrix4(Body.matrix);
			//leftArm.matrix = new Matrix4(baseCubeCoordinatesMatrix);
			//leftArm.matrix.translate(-.5, 0, 0);
			
			//leftArm.matrix.translate(-.4, 0, 0.29);
			leftArm.matrix.translate(0.5, 0.95, 1.05);
			leftArm.matrix.rotate((g_leftArmAngle - 25), 0, 0, 1);
			leftArm.matrix.translate(-.1,0,0); // Comment out if too troublesome.
			leftArm.matrix.scale(0.25, 0.75, .25);
			//leftArm.matrix.scale(1.25, 1.25, 1.25); // Scalefactor
			
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
  /*
leftArm.matrix.translate(0.5, 0.95, 1.05);
			leftArm.matrix.rotate((g_leftArmAngle - 25), 0, 0, 1);
			leftArm.matrix.translate(-.1,0,0); // Comment out if too troublesome.
			leftArm.matrix.scale(0.25, 0.75, .25);
  */
		var rightArm = new Cube();
			rightArm.color = [1, 1, 1, 1];
      rightArm.matrix = new Matrix4(Body.matrix);
			//leftArm.matrix = new Matrix4(baseCubeCoordinatesMatrix);
			//leftArm.matrix.translate(-.5, 0, 0);
			
			//leftArm.matrix.translate(-.4, 0, 0.29);
			rightArm.matrix.translate(0.5, 0.95, -0.2);
			rightArm.matrix.rotate(-110, 0, 0, 1);
			rightArm.matrix.translate(-.1,0,0); // Comment out if too troublesome.
			rightArm.matrix.scale(0.25, 0.75, .25);
      rightArm.matrix.scale(1.2, 1.2, 1.2);
			
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
       tailSegment1.matrix = new Matrix4(Body.matrix);
			tailSegment1.color = [0.95, 0.95, 0.95, 1];
			tailSegment1.matrix.translate(-.16, 0.05, 0.5);
			
			tailSegment1.matrix.rotate(45*Math.sin(g_secondsOnOff * 2), 10, 0, 0.5);
			
			tailSegment1.matrix.scale(0.25, 0.5, .25);
			tailSegment1.matrix.scale(0.5, 0.5, .5); // Scalefactor
      tailSegment1.matrix.scale(2, 2, 2); // Scalefactor
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

var mouseIsDown = false;
var capturedX;
var capturedY;

function mouseDownHandler(ev) { // convertCoordinatesEventToGL
  console.log("Mouse down");
  /*
  if (!mouseIsDown) {
    
    capturedX = ev.clientX; // x coordinate of a mouse pointer
    capturedY = ev.clientY;
  }
    */

  capturedX = ev.clientX; // x coordinate of a mouse pointer
  capturedY = ev.clientY;
  mouseIsDown = true;
  
/*
  console.log("Mouse down");
	var x = ev.clientX; // x coordinate of a mouse pointer
	var y = ev.clientY; // y coordinate of a mouse pointer
  g_camera.rotateBy((capturedX - x) * 0.1, 0);
*/
}

function mouseMoveHandler(ev) {
  if (mouseIsDown) {
    console.log("Mouse down and moving");
    var x = ev.clientX; // x coordinate of a mouse pointer
	  var y = ev.clientY; // y coordinate of a mouse pointer
    g_camera.rotateBy((capturedX - x) * 0.2, (capturedY - y) * 0.2,);

    capturedX = x; // x coordinate of a mouse pointer
    capturedY = y;
  }
}

function mouseUpHandler(ev) { // convertCoordinatesEventToGL
  mouseIsDown = false;
  //console.log("Mouse up");
}


/*
1. On keydown, set a key's flag to "true" in some boolean list.
2. If a key's flag is true, perform the corresponding action.
3. On keyup, unset the flag.

Notes:
1. Use ev.repeat for optimization? 
   * ev.repeat == false on first press. It is true for subsequent inputs when held down.

*/

let W = 87;
let A = 65;
let S = 83;
let D = 68;
let Q = 81;
let E = 69;
let V = 86;
let C = 67;
let R = 82;
let F = 70;

let keyCodeArray = [W, A, S, D, Q, E, V, C, R, F];
let isKeyPressedDown = [
  false, // W
  false, // A
  false, // S
  false, // D
  false, // Q
  false, // E
  false, // SPACEBAR
  false, // CTRL
  false,
  false
];

if (keyCodeArray.length != isKeyPressedDown.length) {
  throw("keyCodeArray and isKeyPressedDown do not match in length!");
}

var walkSpeed = 0.33;
var sprintModifier = 1;
var turnSpeed = 3;
var upDownSpeed = 0.1;
let keyFuncArray = [
  function() {g_camera.moveForward(walkSpeed * sprintModifier); },  // W
  function() {g_camera.moveRight(walkSpeed * sprintModifier); },    // A
  function() {g_camera.moveBack(walkSpeed * sprintModifier); },     // S
  function() {g_camera.moveLeft(walkSpeed * sprintModifier); },     // D
  function() {g_camera.rotateBy( turnSpeed, 0); }, // Q
  function() {g_camera.rotateBy(-turnSpeed, 0); }, // E

  function() {g_camera.moveUp(upDownSpeed); }, // E
  function() {g_camera.moveDown(upDownSpeed); }, // E
  function() {g_camera.rotateBy(0,  turnSpeed); }, // Q
  function() {g_camera.rotateBy(0, -turnSpeed); } // E
]

function inputHandler() {
  for (let idx = 0; idx < isKeyPressedDown.length; idx++) {
    if (isKeyPressedDown[idx]) { keyFuncArray[idx](); }
  }
}

function keypressHandler(ev, onOrOff) {
  if (ev.shiftKey) {
    sprintModifier = 2;
  } else {
    sprintModifier = 1;
  }
  for (let idx = 0; idx < isKeyPressedDown.length; idx++) {
    if ((ev.keyCode == keyCodeArray[idx]) && !ev.repeat) { isKeyPressedDown[idx] = onOrOff; }
  }
  
}




function initTextures(imageLocation, textureUnit, sampler, uniformArg) {
  var image = new Image();
  if (!image) {
    throw("initTextures(): Failed to create the image object at " + imageLocation);
  }

  image.onload = function() { sendImageToTexture(image, textureUnit, sampler, uniformArg); };
  image.src = imageLocation;
}

function sendImageToTexture(image, textureUnit, sampler, uniformArg) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log("sendImageToTexture(): Failed to create the texture object.");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(textureUnit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  const ext =
    gl.getExtension("EXT_texture_filter_anisotropic") ||
    gl.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
    gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
  gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 16);

  gl.uniform1i(sampler, uniformArg);

  //console.log("finished sendImageToTexture");
  return false;
} 



function OLD_keyDown(ev) {
  switch (ev.keyCode) {
    case W:
      g_camera.moveForward(walkSpeed);
      break;
      
    case A:
      g_camera.moveRight(walkSpeed);
      break;

    case S:
      g_camera.moveBack(walkSpeed);
      break;

    case D:
      g_camera.moveLeft(walkSpeed);
      break;

    case Q:
      g_camera.rotateBy(0, turnSpeed);
      break;

    case E:
      g_camera.rotateBy(0, -turnSpeed);
      break;
    
    default:
      console.log("RAAAAAAAAAGH");

  }
}

function OLD_initTextures() {
  var image0 = new Image();
  if (!image0) {
    console.log("initTextures(): Failed to create the image object");
    return false;
  }

  image0.onload = function() { sendImageToTexture(image0, gl.TEXTURE0, u_Sampler0); };
  image0.src = "textures/sky.jpg";

  return true;
}