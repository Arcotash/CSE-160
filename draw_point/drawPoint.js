var VSHADER_SOURCE = `
  attribute vec2 a_Position;
  void main() {
    gl_Position = vec4(0., 0., 0., 1.);
	gl_PointSize =
  }
 `;

// Fragment shader program
var FSHADER_SOURCE =`
  void main() {
    gl_FragColor = vec4(1., 0., 0., 1.);
  }
`;


function main() {
	var canvas = document.getElementById('example'); // Retrieve <canvas> element       
	if (!canvas) {
		console.log('Failed to retrieve the <canvas> element');
		return;
	}
	
	gl = canvas.getContext("webgl2");  // or maybe canvas.getContext("webgl2")
	if ( ! gl ) {
		throw new Error("WebGL not supported; can't create graphics context.");
	}
	
	if (!initShaders(gl. VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Failed to initialize shaders.');
		return;
	}
	
	

	// Get the rendering context for 2DCG 
	var ctx = canvas.getContext('2d');

	// Draw a blue rectangle
	ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set the fillStyle, for use by fillRect.
	ctx.fillRect(0, 0, 50000, 150); // Fill a rectangle with the color set by fillStyle.
	
	
	gl.drawArrays(gl.POINTS, 0, 1);
}




function initShaders(gl, vshader, fshader) {
  var program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.log('Failed to create program');
    return false;
  }

  gl.useProgram(program);
  gl.program = program;

  return true;
}

function createProgram(gl, vshader, fshader) {
  // Create shader object
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // Create a program object
  var program = gl.createProgram();
  if (!program) {
    return null;
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var error = gl.getProgramInfoLog(program);
    console.log('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

function loadShader(gl, type, source) {
  // Create shader object
  var shader = gl.createShader(type);
  if (shader == null) {
    console.log('unable to create shader');
    return null;
  }

  // Set the shader program
  gl.shaderSource(shader, source);

  // Compile the shader
  gl.compileShader(shader);

  // Check the result of compilation
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader);
    console.log('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}


