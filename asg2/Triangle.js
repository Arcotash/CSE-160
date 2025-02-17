class Triangle {
	constructor() {
		this.type = 'triangle';
		this.position = [0., 0., 0.];
		this.color = [1., 1., 1., 1.];
		this.size = 5.;
	}
	
	render(vertices) {
		var xy   = this.position;
		var rgba = this.color;
		var size = this.size;
		
		// Specify vertex shader
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		gl.uniform1f(u_Size, size);
		
		var d = this.size/200.
		// Draw a point whose position and color is given by a_Position and u_FragColor respectively.
		if (vertices == null) {
			vertices = [xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d];
		}
		drawTriangle( vertices );
	}
}

function drawTriangle(vertices) {
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
  
  gl.drawArrays(gl.TRIANGLES, 0, n);
}


function drawTriangle3D(vertices) {
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
  
  gl.drawArrays(gl.TRIANGLES, 0, n);
}