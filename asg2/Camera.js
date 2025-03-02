// #include "cuon-matrix-cse160.js"
class Camera {
    constructor() {
        this.eye = new Vector3([0, 0, 3]);
        this.at = new Vector3([0, 0, -100]);
        this.up = new Vector3([0, 1, 0]);
    }

    moveForward() {
        var dist_normed = new Vector3();
        dist_normed.set(this.at).sub(this.eye).normalize();

        this.at.add(dist_normed);
        this.eye.add(dist_normed);
    }

    moveBack() {
        var dist_normed = new Vector3();
        dist_normed.set(this.at).sub(this.eye).normalize();

        this.at.sub(dist_normed);
        this.eye.sub(dist_normed);
    }

    moveLeft() {
        var dist_normed = new Vector3();
        dist_normed.set(this.at).sub(this.eye).normalize();

        var left_vec_normed = Vector3.cross(dist_normed, this.up).normalize();

        this.at.add(left_vec_normed);
        this.eye.add(left_vec_normed);
    }

    moveRight() {
        var dist_normed = new Vector3();
        dist_normed.set(this.at).sub(this.eye).normalize();

        var left_vec_normed = Vector3.cross(dist_normed, this.up).normalize();

        this.at.sub(left_vec_normed);
        this.eye.sub(left_vec_normed); 
    }

    rotateBy(theta, phi) { // theta = horizontal, phi = vert
        var hRotateMat = new Matrix4().setRotate(theta, 1, 0, 0);
        this.at = hRotateMat.multiplyVector3(this.at).add(this.eye);

        var vRotateMat = new Matrix4().setRotate(phi, 0, 1, 0);
        this.at = vRotateMat.multiplyVector3(this.at).add(this.eye);
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



