// DrawTriangle.js (c) 2012 matsuda
function main() {  
	// Retrieve <canvas> element
	canvas = document.getElementById('canvas1');  
	if (!canvas) { 
	console.log('Failed to retrieve the <canvas> element');
	return false; 
	} 

	// Get the rendering context for 2DCG
	ctx = canvas.getContext('2d');

	// Draw a blue rectangle
	ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
	ctx.fillRect(0, 0, canvas.width, canvas.width);        // Fill a rectangle with the color

	ctx.lineWidth = 2;
	origin = [canvas.width/2, canvas.height/2]


	
	

	
}



function drawVector(v, color) {
	ctx.strokeStyle = color
	ctx.beginPath();
		ctx.moveTo(origin[0], origin[1]); // Set the origin.
		ctx.lineTo(origin[0] + 20 * v.elements[0], origin[1] + 20 * v.elements[1]);
	ctx.stroke();
}


function handleDrawEvent() {
	ctx.fillRect(0, 0, canvas.width, canvas.width);
	
	let v1 = new Vector3([ 	Number(document.getElementById("v1_x").value), 
							Number(document.getElementById("v1_y").value), 
							0 ]);
	let v2 = new Vector3([ 	Number(document.getElementById("v2_x").value), 
							Number(document.getElementById("v2_y").value), 
							0 ]);
	
	drawVector(v1, "red")
	drawVector(v2, "blue")
	
}




function handleDrawOperationEvent() {
	ctx.fillRect(0, 0, canvas.width, canvas.width);
	
	let v1 = new Vector3([ 	Number(document.getElementById("v1_x").value), 
							Number(document.getElementById("v1_y").value), 
							0 ]);
	let v2 = new Vector3([ 	Number(document.getElementById("v2_x").value), 
							Number(document.getElementById("v2_y").value), 
							0 ]);
	
	drawVector(v1, "red")
	drawVector(v2, "blue")
	
	
	//let v0 = new Vector3([20,20,0]);
	//drawVector(v0, "blue")
	
	let operation = document.getElementById("operation_select").value;
	if ((operation == "Add") || (operation == "Subtract")) {
		let v3 = new Vector3([0,0,0]);
		if (operation == "Add") {
			v3.set(v1);
			v3.add(v2);
		} else {
			v3.set(v1);
			v3.sub(v2);
		}
		drawVector(v3, "rgb(0, 255, 0, 0.4)");
	} else if ((operation == "Multiply") || (operation == "Divide")) {
		let s = Number(document.getElementById("scalar").value)
		v3 = new Vector3([0,0,0]);
		v4 = new Vector3([0,0,0]);
		if (operation == "Multiply") {
			v3.set(v1);
			v3.mul(s);
		} else {
			v3.set(v1);
			v3.div(s);
		}
		drawVector(v3, "rgb(0, 255, 0, 0.4)");
		drawVector(v4, "rgb(0, 255, 0, 0.4)");
	} else if (operation == "Magnitude") {
		console.log("Magnitude v1: %2f", v1.magnitude());
		console.log("Magnitude v2: %2f", v2.magnitude());
	} else if (operation == "Normalize") {
		v1.normalize();
		v2.normalize();
		drawVector(v1, "rgb(0, 255, 0, 0.4)")
		drawVector(v2, "rgb(0, 255, 0, 0.4)")
	} else if (operation == "Angle Between") {
		console.log("Angle: %f", angleBetween(v1, v2));
	} else if (operation == "Area of Formed Triangle") {
		let v3 = Vector3.cross(v1, v2);
		console.log(v3.elements[2] / 2);
		//drawVector(v3, "purple");
	}
	
	

}

function angleBetween(v1, v2) {
	return Math.acos( Vector3.dot(v1, v2) / (v1.magnitude() * v2.magnitude()) ) * (180/Math.PI);
}


function redraw_canvas() {
	console.log("redraw_canvas() called.")
	
	ctx.fillRect(0, 0, canvas.width, canvas.width);
	
	vector1 = new Vector3([1, 2, 3]);
	
	
	let v1 = new Array();
	v1.push(Number(document.getElementById("v1_x").value));
	v1.push(Number(document.getElementById("v1_y").value));
	
	let v2 = new Array();
	v2.push(Number(document.getElementById("v2_x").value));
	v2.push(Number(document.getElementById("v2_y").value));
	
	ctx.strokeStyle = "red"
	ctx.beginPath();
		ctx.moveTo(origin[0], origin[1]); // Set the origin.
		ctx.lineTo(origin[0] + v1[0], origin[1] + v1[1]);
	ctx.stroke();
	
	ctx.strokeStyle = "blue";
	ctx.beginPath();
		ctx.moveTo(origin[0], origin[1]); // Set the origin.
		ctx.lineTo(origin[0] + v2[0], origin[1] + v2[1]);
	ctx.stroke();
	
	ctx.strokeStyle = "rgb(0, 255, 0, 0.4)";
	//ctx.globalAlpha = 0.6;
	let operation = document.getElementById("operation_select").value;
	if (operation == "Add" ) {
		ctx.beginPath();
			ctx.moveTo(origin[0], origin[1]); // Set the origin.
			ctx.lineTo(origin[0] + (v1[0] + v2[0]), origin[1] + (v1[1] + v2[1]));
		ctx.stroke();
	} else if (operation == "Subtract" ) {
		ctx.beginPath();
		ctx.moveTo(origin[0], origin[1]); // Set the origin.
		ctx.lineTo(origin[0] + (v1[0] - v2[0]), origin[1] + (v1[1] - v2[1]));
		
	} else if (operation == "Multiply" ) {
		let s = Number(document.getElementById("scalar").value)
		ctx.beginPath();
			ctx.moveTo(origin[0], origin[1]); // Set the origin.
			ctx.lineTo(origin[0] + (v1[0] * s), origin[1] + (v1[1] * s));
		ctx.stroke();
		ctx.beginPath();
			ctx.moveTo(origin[0], origin[1]); // Set the origin.
			ctx.lineTo(origin[0] + (v2[0] * s), origin[1] + (v2[1] * s));
		ctx.stroke();
	} else if (operation == "Divide" ) {
		let s = Number(document.getElementById("scalar").value)
		ctx.beginPath();
			ctx.moveTo(origin[0], origin[1]); // Set the origin.
			ctx.lineTo(origin[0] + (v1[0] / s), origin[1] + (v1[1] / s));
		ctx.stroke();
		ctx.beginPath();
			ctx.moveTo(origin[0], origin[1]); // Set the origin.
			ctx.lineTo(origin[0] + (v2[0] / s), origin[1] + (v2[1] / s));
		ctx.stroke();
	}
	
	
	
}