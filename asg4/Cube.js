class Cube {
	constructor() {
		this.type = 'cube';
		this.color = [1., 1., 1., 1.];
		this.matrix = new Matrix4();
		this.normalMatrix = new Matrix4();
		this.textureNum = -2;
		/* 
		Orientations are described facing negative Z, with 
		the up vector pointing into positive Y.
		*/
		this.cubeVerts = new Float32Array ([
			

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
		// 1,1,   1,1,   1,1,
		this.UVVerts = new Float32Array ([
			0,0,   1,0,   1,1,
			0,0,   0,1,   1,1, 

			0,0,   1,0,   1,1,
			0,0,   0,1,   1,1, 

			0,0,   1,0,   1,1,
			0,0,   0,1,   1,1, 

			0,0,   1,0,   1,1,
			0,0,   0,1,   1,1,   

			0,0,   1,0,   1,1,
			0,0,   0,1,   1,1, 

			0,0,   1,0,   1,1,
			0,0,   0,1,   1,1, 

		]);

		this.cubeNormals = new Float32Array ([

			1,0,0,  1,0,0,  1,0,0,
			1,0,0,  1,0,0,  1,0,0,
			-1,0,0,  -1,0,0,  -1,0,0,
			-1,0,0,  -1,0,0,  -1,0,0,

			0,0,1,  0,0,1,  0,0,1,
			0,0,1,  0,0,1,  0,0,1,

			
			0,0,-1,  0,0,-1,  0,0,-1,
			0,0,-1,  0,0,-1,  0,0,-1,



			0,1,0,  0,1,0,  0,1,0,
			0,1,0,  0,1,0,  0,1,0,  

			0,-1,0,  0,-1,0,  0,-1,0,
			0,-1,0,  0,-1,0,  0,-1,0,  

			








		]);
	}

	render() {
		var n = this.cubeVerts.length/3;
		var rgba = this.color;


		if ((this.textureNum == -2)) {
			if (g_normalOn) {
				this.textureNum = -3;
			} else {
				this.textureNum = -2;
			}
			
		}

		this.normalMatrix.setInverseOf(this.matrix).transpose();

		gl.uniform1i(u_whichTexture, this.textureNum);

		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
		gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
		
		if (g_vertexBuffer==null || g_UVBuffer==null) {
			initTriangle3D();
		}
		
		// Vertex Buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);
		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position);
		gl.bufferData(gl.ARRAY_BUFFER, this.cubeVerts, gl.DYNAMIC_DRAW);

		// UV Buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, g_UVBuffer);
		gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_UV);
		gl.bufferData(gl.ARRAY_BUFFER, this.UVVerts, gl.DYNAMIC_DRAW);
		

		// Normal Buffer
		///*
		gl.bindBuffer(gl.ARRAY_BUFFER, g_normalBuffer);
		gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Normal);
		gl.bufferData(gl.ARRAY_BUFFER, this.cubeNormals, gl.DYNAMIC_DRAW);

		//*/


		gl.drawArrays(gl.TRIANGLES, 0, n)


	}

	render_old() {
		var rgba = this.color;

		gl.uniform1i(u_whichTexture, this.textureNum);

		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
		gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);


		drawTriangle3DUVNormal(this.cubeVerts, this.UVVerts, this.cubeNormals);
		


	}
}















