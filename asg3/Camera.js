// #include "cuon-matrix-cse160.js"
class Camera {
    constructor() {
        this.eye = new Vector3([0, .5, 0]);
        this.at = new Vector3([-100, 0, 0]);
        this.up = new Vector3([0, 1.5, 0]);
    }

    moveForward(increment) {
        var dist_normed = new Vector3();
        dist_normed.set(this.at).sub(this.eye).normalize();

        this.at.add(dist_normed.mul(increment));
        this.eye.add(dist_normed.mul(increment));
    }

    moveBack(increment) {
        var dist_normed = new Vector3();
        dist_normed.set(this.at).sub(this.eye).normalize();

        this.at.sub(dist_normed.mul(increment));
        this.eye.sub(dist_normed.mul(increment));
    }

    moveLeft(increment) {
        var dist_normed = new Vector3();
        dist_normed.set(this.at).sub(this.eye).normalize();

        var left_vec_normed = Vector3.cross(dist_normed, this.up).normalize();

        this.at.add(left_vec_normed.mul(increment));
        this.eye.add(left_vec_normed.mul(increment));
    }

    moveRight(increment) {
        var dist_normed = new Vector3();
        dist_normed.set(this.at).sub(this.eye).normalize();

        var left_vec_normed = Vector3.cross(dist_normed, this.up).normalize();

        this.at.sub(left_vec_normed.mul(increment));
        this.eye.sub(left_vec_normed.mul(increment)); 
    }

    moveDown(increment) {
        var upVec = new Vector3([0, increment, 0]);
        this.at.sub(upVec);
        this.eye.sub(upVec);
    }

    moveUp(increment) {
        var upVec = new Vector3([0, increment, 0]);
        this.at.add(upVec);
        this.eye.add(upVec);
    }

    rotateBy(theta, phi) { // theta = horizontal, phi = vert
        var dist_vec;
        if (theta != 0) {
            dist_vec = new Vector3().set(this.at).sub(this.eye);
            var hRotateMat = new Matrix4().setRotate(theta, 0, 1, 0);
            this.at = hRotateMat.multiplyVector3(dist_vec).add(this.eye);

            

           
        }
        
        if ((phi != 0) ) {
            var dist_normed = new Vector3();
            dist_normed.set(this.at).sub(this.eye).normalize();

            var angle = Math.atan(dist_normed.elements[1], dist_normed.elements[2]) * 180/Math.PI * 2; // Not quite correct but also good enough.
            if (((angle >= 88) && (phi > 0)) || (angle <= -88) && (phi < 0)) {
                return;
            }

            var left_vec_normed = Vector3.cross(dist_normed, this.up).normalize();


            var vRotateMat = new Matrix4().setRotate(phi, left_vec_normed.elements[0], left_vec_normed.elements[1], left_vec_normed.elements[2]); // Cross product of at and up

            dist_vec = new Vector3().set(this.at).sub(this.eye);
            this.at = vRotateMat.multiplyVector3(dist_vec).add(this.eye);


            //dist_vec = new Vector3().set(this.up).sub(this.eye);
            //this.up = vRotateMat.multiplyVector3(dist_vec).add(this.eye);
            
            //dist_vec = new Vector3().set(this.at).sub(this.eye);
            //var left_vec_normed = Vector3.cross(dist_vec, this.up).normalize();
            //this.up = Vector3.cross(dist_vec, left_vec_normed).normalize().mul(-1);
        }
    }
}


 /*
        var dist = new Vector3();
        dist.set(at).sub(eye);

        var hor_rotate_mat = new Matrix4([
            Math.cos(theta), 0, Math.sin(theta), 0,
            0, 1, 0, 0,
           -Math.sin(theta), 0, Math.cos(theta), 0,
            0, 0, 0, 1,
        ]);


        var vert_rotate_mat = new Matrix4([
            1, 0, 0, 0,
            0, Math.cos(phi), -Math.sin(phi), 0,
            0, Math.sin(phi),  Math.cos(phi), 0,
            0, 0, 0, 1,
        ]);

        */



