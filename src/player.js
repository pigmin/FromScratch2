import { AxesViewer, Color3, MeshBuilder, StandardMaterial, Vector3 } from '@babylonjs/core';

const SPEED = 5.0;

class Player {

    mesh;

    axes;

    scene;
    camera;

    //Vecteur d'input
    moveInput = new Vector3(0, 0, 0);

    //Vecteur de deplacement
    moveDirection = new Vector3(0, 0, 0);

    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.init();
    }

    init() {
        this.mesh = MeshBuilder.CreateBox('playerMesh', {size: 2});
        this.mesh.material = new StandardMaterial("playerMat", this.scene);
        this.mesh.material.diffuseColor = new Color3(1, 0, 0);
        this.mesh.visibility = 0.6;
        this.mesh.position = new Vector3(3, 1, 2);

        this.axes = new AxesViewer(this.scene, 3);
        this.axes.xAxis.parent = this.mesh;
        this.axes.yAxis.parent = this.mesh;
        this.axes.zAxis.parent = this.mesh;
    }

    update(delta, inputMap, actions) {

        this.getInputs(inputMap, actions);

        this.applyCameraToInputs();
        this.move(delta);
    }

    getInputs(inputMap, actions) {

        this.moveInput.set(0, 0, 0);

        if (inputMap["KeyA"]) {
            this.moveInput.x = -1;
        }
        else if (inputMap["KeyD"]) {
            this.moveInput.x = 1;
        }

        
        if (inputMap["KeyW"]) {
            this.moveInput.z = 1;
        }
        else if (inputMap["KeyS"]) {
            this.moveInput.z = -1;
        }

        if (actions["Space"]) {
            //TODO jump
        }

    }

    applyCameraToInputs() {
        
        this.moveDirection.set(0, 0, 0);

        if (this.moveInput.length() != 0) {

            //Recup le forward de la camera
            let forward = this.getForwardVector(this.camera);
            forward.y = 0;
            forward.normalize();
            forward.scaleInPlace(this.moveInput.z);

            //Recup le right de la camera
            let right = this.getRightVector(this.camera);
            right.y = 0;
            right.normalize();
            right.scaleInPlace(this.moveInput.x);

            //Add les deux vect
            this.moveDirection = right.add(forward);

            //Normalise
            this.moveDirection.normalize();
            
        }
    }

    move(delta) {

        if (this.moveDirection.length() != 0) {
            
            this.moveDirection.scaleInPlace(SPEED * delta);

            this.mesh.position.addInPlace(this.moveDirection);

        }
    }

    getUpVector(_mesh, refresh) {
        _mesh.computeWorldMatrix(true, refresh);
        var up_local = new Vector3(0, 1, 0);
        const worldMatrix = _mesh.getWorldMatrix();
        return Vector3.TransformNormal(up_local, worldMatrix);
    }

    getForwardVector(_mesh, refresh) {
        _mesh.computeWorldMatrix(true, refresh);
        var forward_local = new Vector3(0, 0, 1);
        const worldMatrix = _mesh.getWorldMatrix();
        return Vector3.TransformNormal(forward_local, worldMatrix).normalize();
    }

    getRightVector(_mesh, refresh) {
        _mesh.computeWorldMatrix(true, refresh);
        var right_local = new Vector3(1, 0, 0);
        const worldMatrix = _mesh.getWorldMatrix();
        return Vector3.TransformNormal(right_local, worldMatrix).normalize();
    }
}

export default Player;