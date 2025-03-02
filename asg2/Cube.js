class Cube {
	constructor() {
		this.type = 'cube';
		this.color = [1., 1., 1., 1.];
		this.matrix = new Matrix4();
		this.textureNum = -2;
		this.cubeVerts = new Float32Array ([
			0,0,0, 1,1,0, 1,0,0,
			0,0,0, 0,1,0, 1,1,0,

			0,1,0, 0,1,1, 1,1,1,
			0,1,0, 1,1,1, 1,1,0,

			1,1,0, 1,1,1, 1,0,0,
			1,0,0, 1,1,1, 1,0,1,
			
			0,1,0, 0,1,1, 0,0,0,
			0,0,0, 0,1,1, 0,0,1,

			0,0,0, 0,0,1, 1,0,1,
			0,0,0, 1,0,1, 1,0,0,

			0,0,1, 1,1,1, 1,0,1,
			0,0,1, 0,1,1, 1,1,1,
		]);
	}

	render() {
		var rgba = this.color;

		//gl.uniform1i(u_whichTexture, -2);
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
		
		if (g_vertexBuffer==null) {
			initTriangle3D();
		}
		
		gl.bufferData(gl.ARRAY_BUFFER, this.cubeVerts, gl.DYNAMIC_DRAW);
		gl.drawArrays(gl.TRIANGLES, 0, 36);
	}
}










