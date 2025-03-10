class Point {
	constructor() {
		this.type = 'point';
		this.position = [0., 0., 0.];
		this.color = [1., 1., 1., 1.];
		this.size = 5.;
	}
	
	render() {
		var xy   = this.position;
		var rgba = this.color;
		var size = this.size;

		// Pass the position of a point to a_Position variable
		gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.);
		// Pass the color of a point to u_FragColor variable
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		
		// Pass the color of a point to u_FragColor variable
		gl.uniform1f(u_Size, size);
		
		// Draw a point whose position and color is given by a_Position and u_FragColor respectively.
		gl.drawArrays(gl.POINTS, 0, 1);
	}
}


