class Player extends Character {
    constructor(positionVector3, Euler, url) {
        super(positionVector3, Euler, url)
        this.triggerjump = false;
        this.moveVec = new OIMO.Vec3();


        this.rigidBody = new OIMO.RigidBody({
            type: 0,
            angularDamping: 1,
            linearDamping: 10,
            angularVelocity: new OIMO.Vec3(),
            position: THREEtoOimoVec(positionVector3),
            linearVelocity: new OIMO.Vec3(),
            autoSleep: true,
            rotation: new OIMO.Mat3(),

        })


        this.rigidBody.addShape(new OIMO.Shape({
            collisionGroup: 1,
            collisionMask: 1,
            density: 100,
            geometry: new OIMO.CylinderGeometry(5, 10),
            friction: 0,
            restitution: 0,
            rotation: new OIMO.Mat3(),
            position: new OIMO.Vec3(0, 10, 0),

        }))

        this.rigidBody.setRotationFactor(new OIMO.Vec3(0, 0, 0))
        GM.physics.world.addRigidBody(this.rigidBody);
        this.rigidBody.setGravityScale(10)


        this.cameraHelper = new Component(new THREE.Vector3(-5, 20, -15), new THREE.Euler(0, 0, 0));
        this.crossHairHelper = new Component(new THREE.Vector3(0, 0, 0), new THREE.Euler(0, 0, 0));
        this.crossHairHelper.cross = new Component(new THREE.Vector3(-5, 20, 5), new THREE.Euler(0, 0, 0));
        this.crossHairHelper.addChlidContainer(this.crossHairHelper.cross.container)
        this.model.addChlidContainer(this.cameraHelper.container);
        this.model.addChlidContainer(this.crossHairHelper.container);

        let axes = new THREE.AxesHelper(10)
        this.crossHairHelper.cross.addChlidContainer(axes)
        this.crossHairHelper.setMatrixAutoUpdate(true)


        this.isCameraBind = false;


        this.bindCamera()

    }


    bindCamera() {
        this.isCameraBind = true;
        this.model.setMatrixAutoUpdate(true);


    }

    controlCamera(mouse) {

        this.model.container.rotation.y -= mouse.x * 0.002;
        this.crossHairHelper.container.rotation.x += mouse.y * 0.002;
        this.crossHairHelper.container.rotation.x = Math.min(1.2, Math.max(-.4, this.crossHairHelper.container.rotation.x));
    }

    handleCamera() {
        this.crossHairHelper.container.updateMatrixWorld(true)
        this.crossHairHelper.cross.container.updateMatrixWorld(true)
        this.model.container.updateMatrixWorld(true)
        let vector = new THREE.Vector3();
        vector.setFromMatrixPosition(this.cameraHelper.container.matrixWorld);
        let vector2 = new THREE.Vector3();
        vector2.setFromMatrixPosition(this.crossHairHelper.cross.container.matrixWorld);

        GM.camera.position.copy(vector);
        GM.camera.lookAt(vector2)


    }

    update(deltaTime) {

        super.update(deltaTime)
        this.wholeMoveHandler()

        if (this.isCameraBind) {
            this.handleCamera();
        }
    }

    wholeMoveHandler() {
        this.checkIfGravityNeedsToBeScaled();
        this.move();
        if (this.triggerjump) {
            this.triggerjump = false;
            this.rigidBody.addLinearVelocity(new OIMO.Vec3(0, 350, 0))
        }

        let posVect = OIMOtoThreeVec3(this.rigidBody.getPosition());
        this.model.container.position.set(posVect.x, posVect.y, posVect.z)
    }

    move() {
        this.moveVec.scaleEq(7)
        this.rigidBody.addLinearVelocity(this.moveVec)
        this.moveVec.x = 0; //reset vectora
        this.moveVec.z = 0; //reset vectora
    }

    jump() {
        this.triggerjump = true;
    }

    checkIfGravityNeedsToBeScaled() {
        if (this.rigidBody.getNumContectLinks() > 0) {
            this.rigidBody.setGravityScale(10)
        } else {
            this.rigidBody.setGravityScale(100)
        }
    }

    moveForward() {
        let vector = THREEtoOimoVec(this.model.getWorldDirection())
        this.moveVec.addEq(vector)
        this.moveVec.normalize();

    }

    moveBackward() {
        let vector = this.model.getWorldDirection();
        vector.applyEuler(new THREE.Euler(0, Math.PI, 0))
        this.moveVec.addEq(THREEtoOimoVec(vector))
        this.moveVec.normalize();
    }

    moveLeft() {
        let vector = this.model.getWorldDirection();
        vector.applyEuler(new THREE.Euler(0, Math.PI / 2, 0))
        this.moveVec.addEq(THREEtoOimoVec(vector))
        this.moveVec.normalize();
    }

    moveRight() {
        let vector = this.model.getWorldDirection();
        vector.applyEuler(new THREE.Euler(0, -Math.PI / 2, 0))
        this.moveVec.addEq(THREEtoOimoVec(vector))
        this.moveVec.normalize();
    }


}

