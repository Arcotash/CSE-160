class Cube {
	constructor() {
		this.type = 'cube';
		this.color = [1., 1., 1., 1.];
		this.matrix = new Matrix4();
		this.textureNum = -2;
		/* 
		Orientations are described facing negative Z, with 
		the up vector pointing into positive Y.
		*/
		this.cubeVerts = new Float32Array ([
			0,0,0, 1,0,0, 1,1,0, // Left face (CORRECT)
			0,0,0, 0,1,0, 1,1,0,   // >

			0,1,0, 0,1,1, 1,1,1, // Top Face (CORRECT)
			0,1,0, 1,1,0, 1,1,1,

			1,1,1,   1,1,0, 1,0,0, // Front (CORRECT)
			1,1,1,  1,0,1, 1,0,0,
			
			0,1,1, 0,1,0, 0,0,0, // Back 
			0,1,1,  0,0,1, 0,0,0, // 

			0,0,0, 0,0,1, 1,0,1, // Down
			0,0,0,  1,0,0, 1,0,1,

			0,0,1,  1,0,1, 1,1,1, // Right
			0,0,1, 0,1,1, 1,1,1,
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
	}

	render() {
		var rgba = this.color;

		gl.uniform1i(u_whichTexture, this.textureNum);

		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
		
		if (g_vertexBuffer==null || g_UVBuffer==null) {
			initTriangle3D();
		}
		

		gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);
		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position);

		gl.bufferData(gl.ARRAY_BUFFER, this.cubeVerts, gl.DYNAMIC_DRAW);
		gl.drawArrays(gl.TRIANGLES, 0, 36);

		
		gl.bindBuffer(gl.ARRAY_BUFFER, g_UVBuffer);
		gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_UV);

		gl.bufferData(gl.ARRAY_BUFFER, this.UVVerts, gl.DYNAMIC_DRAW);
		gl.drawArrays(gl.TRIANGLES, 0, 24)
	}
}










