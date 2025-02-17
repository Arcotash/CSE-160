class Cube {
	constructor() {
		this.type = 'cube';
		//this.position = [0., 0., 0.];
		this.color = [1., 1., 1., 1.];
		//this.size = 5.;
		//this.segments = 10;
		this.matrix = new Matrix4();
	}
	
	render() {
		//var xy   = this.position;
		var rgba = this.color;
		//var size = this.size;
		

		// Pass the color of a point to u_FragColor variable
		
		
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
		
		//Front of cube
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		drawTriangle3D( [0.,0.,0., 1.,1.,0., 1.,0.,0.] );
		drawTriangle3D( [0.,0.,0., 0.,1.,0., 1.,1.,0.] );
		
		//Back
		gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]); 
		drawTriangle3D( [0.,0.,1., 1.,1.,1., 1.,0.,1.] );
		drawTriangle3D( [0.,0.,1., 0.,1.,1., 1.,1.,1.] );
		
		
		//gl.uniform4f(u_FragColor, rgba[0] * 0.2, rgba[1] * 0.2, rgba[2], rgba[3]);
		
		
		
		//Faces 2
			//Top of cube
			gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
			drawTriangle3D( [0.,1.,0., 0.,1.,1., 1.,1.,1.] );
			drawTriangle3D( [0.,1.,0., 1.,1.,1., 1.,1.,0.] );
			
			// Other side
			gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]); 
			drawTriangle3D( [1.,0.,1., 0.,0.,0., 0.,0.,1.] );
			drawTriangle3D( [1.,0.,1., 0.,0.,0., 1.,0.,0.] );
		
		// Faces 3
			gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]); 
			drawTriangle3D( [1.,1.,0., 1.,1.,1., 1.,0.,1.] );
			drawTriangle3D( [1.,1.,0., 1.,0.,0., 1.,0.,1.] );
			
			gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]); 
			drawTriangle3D( [0.,1.,0., 0.,1.,1., 0.,0.,1.] );
			drawTriangle3D( [0.,1.,0., 0.,0.,0., 0.,0.,1.] );
		
		
		
		
	}
}










