class Sphere {
	constructor() {
		this.type = 'sphere';
		this.color = [1., 1., 1., 1.];
		this.matrix = new Matrix4();
		this.textureNum = -2;
		/* 
		Orientations are described facing negative Z, with 
		the up vector pointing into positive Y.
		*/
		this.vertices = new Float32Array ([
			

			1,1,1,  1,1,0,  1,0,0, // Front
			1,1,1,  1,0,1,  1,0,0,
			
			0,1,1,  0,1,0,  0,0,0, // Back 
			0,1,1,  0,0,1,  0,0,0, // 

			

			0,0,1,  1,0,1,  1,1,1, // Right
			0,0,1,  0,1,1,  1,1,1,

			0,0,0,  1,0,0,  1,1,0, // Left face 
			0,0,0,  0,1,0,  1,1,0, 

			0,1,0,  0,1,1,  1,1,1, // Top Face
			0,1,0,  1,1,0,  1,1,1,

			0,0,0,  0,0,1,  1,0,1, // Down
			0,0,0,  1,0,0,  1,0,1,
		]);

	}

	render() {
		var rgba = this.color;
		gl.uniform1i(u_whichTexture, this.textureNum);
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var d = Math.PI/10;
        var dd = Math.PI/10;

        for (var t=0; t<Math.PI; t+=d) {
            for (var r=0; r<(2 * Math.PI); r+=d) {
                var p1 = [Math.sin(t) * Math.cos(r), Math.sin(t) * Math.sin(r), Math.cos(t)];
                var p2 = [Math.sin(t + dd) * Math.cos(r), Math.sin(t + dd) * Math.sin(r), Math.cos(t + dd)];

                var p3 = [Math.sin(t) * Math.cos(r + dd), Math.sin(t) * Math.sin(r + dd), Math.cos(t)];
                var p4 = [Math.sin(t + dd) * Math.cos(r + dd), Math.sin(t + dd) * Math.sin(r + dd), Math.cos(t + dd)];
                
                var uv1 = [t/Math.PI, r/(2*Math.PI)];
                var uv2 = [(t+dd)/Math.PI, r/(2*Math.PI)];
                var uv3 = [t/Math.PI, (r+dd)/(2*Math.PI)];
                var uv4 = [(t+dd)/Math.PI, (r+dd)/(2*Math.PI)];

                var v = [];
                var uv = [];


                v = v.concat(p1); uv = uv.concat(uv1);
                v = v.concat(p2); uv = uv.concat(uv2);
                v = v.concat(p4); uv = uv.concat(uv4);
                gl.uniform4f(u_FragColor, 1,0,1,1);
                drawTriangle3DUVNormal(v, uv, v);


                v = []; uv = [];
                v = v.concat(p1); uv = uv.concat(uv1);
                v = v.concat(p3); uv = uv.concat(uv3);
                v = v.concat(p4); uv = uv.concat(uv4);
                gl.uniform4f(u_FragColor, 1,1,1,1);
                drawTriangle3DUVNormal(v, uv, v);
            }
        }
		
	}
}


function drawTriangle3DUVNormal(vertices, uv, normal) {
	var n = vertices.length/3;
	
	var vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) {
	  console.log('Failed to create the vertex buffer object');
	  return -1;
	}
  
	var UVBuffer = gl.createBuffer();
	if (!UVBuffer) {
	  console.log('Failed to create the UV buffer object');
	  return -1;
	}
  
	var normalBuffer = gl.createBuffer();
	if (!normalBuffer) {
	  console.log('Failed to create the normal buffer object');
	  return -1;
	}

	// Vertex Buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_Position);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

	// UV Buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, UVBuffer);
	gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_UV);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
	

	// Normal Buffer
	///*

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Normal);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.DYNAMIC_DRAW);
	//*/


	gl.drawArrays(gl.TRIANGLES, 0, n);


}









