class Player extends Character {
    constructor(positionVector3, Euler) {
        super(positionVector3, Euler)
        this.triggerjump = false;
        this.moveVec = new OIMO.Vec3();


        this.rigidBody = new OIMO.RigidBody({
            type: 0,
            angularDamping: 10,
            linearDamping: 10,
            angularVelocity: new OIMO.Vec3(),
            position: THREEtoOimoVec(positionVector3),
            linearVelocity: new OIMO.Vec3(),
            autoSleep: true,
            rotation: new OIMO.Mat3(),

        })
        this.rigidBody.three = this.model.container;


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

        this.raycaster = new THREE.Raycaster();


        this.rigidBody.setRotationFactor(new OIMO.Vec3(0, 0, 0))
        GM.physics.world.addRigidBody(this.rigidBody);


        this.cameraHelper = new Component(new THREE.Vector3(-5, 20, -15), new THREE.Euler(0, 0, 0));
        this.crossHairHelper = new Component(new THREE.Vector3(0, 0, 0), new THREE.Euler(0, 0, 0));
        this.crossHairHelper.cross = new Component(new THREE.Vector3(-5, 20, 5), new THREE.Euler(0, 0, 0));
        this.crossHairHelper.addChlidContainer(this.crossHairHelper.cross.container)
        this.model.addChlidContainer(this.cameraHelper.container);
        this.model.addChlidContainer(this.crossHairHelper.container);

        let axes = new THREE.AxesHelper(10);
        this.crossHairHelper.cross.addChlidContainer(axes);
        this.isCameraBind = false;
        this.debugRaycater = false;
        this.inAir = false;
        this.rotation = new THREE.Vector3(0, 0, 1);
        this.bindedCube = null;
        this.model.addChlidContainer(GM.UI.plane.container)
        this.bindCamera()
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;


    }


    bindCamera() {
        this.isCameraBind = true;
    }

    updateMatrix() {


        this.model.container.updateMatrixWorld(true)
    }

    controlCamera(mouse) {

        this.model.container.rotation.y -= mouse.x * 0.002;

        this.rotation = new THREE.Vector3(0, 0, 1);
        this.rotation.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.model.container.rotation.y);

        this.crossHairHelper.container.rotation.x += mouse.y * 0.002;
        this.crossHairHelper.container.rotation.x = Math.min(1.2, Math.max(-.4, this.crossHairHelper.container.rotation.x));
    }

    handleCamera() {
        this.updateMatrix()
        let vector = new THREE.Vector3();
        vector.setFromMatrixPosition(this.cameraHelper.container.matrixWorld);
        let vector2 = new THREE.Vector3();
        vector2.setFromMatrixPosition(this.crossHairHelper.cross.container.matrixWorld);

        GM.camera.position.copy(vector);
        GM.camera.lookAt(vector2)


    }

    update(deltaTime) {

        this.wholeMoveHandler()
        super.update(deltaTime)


        if (this.isCameraBind) {
            this.handleCamera();
        }
    }

    wholeMoveHandler() {

        this.checkIfGravityNeedsToBeScaled()
        this.move();
        let animation = 'Idle'
        if (this.forward) {
            animation = 'Running'
        }
        if (this.right && this.left) {
            animation = 'Running'
        }
        else if (this.right) {
            animation = 'RightStrafe'
        } else if (this.left) {
            animation = 'LeftStrafe'
        }
        if (this.backward) {
            animation = 'RunningBackward'
        }

        if (this.triggerjump) {
            this.triggerjump = false;

            this.rigidBody.addLinearVelocity(new OIMO.Vec3(0, 350, 0))
        }

        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;
        if (this.model.currentAnimation != animation) {
            this.model.setAnimation(animation)
        }
        let posVect = OIMOtoThreeVec3(this.rigidBody.getPosition());
        GM.netHandler.infoFromPlayer(posVect, this.model.container.rotation.y, animation)
        this.model.container.position.set(posVect.x, posVect.y, posVect.z)
    }

    move() {
        this.moveVec.scaleEq(10)
        this.rigidBody.addLinearVelocity(this.moveVec)
        this.moveVec.x = 0; //reset vectora
        this.moveVec.z = 0; //reset vectora
        this.moveVec.y = 0; //reset vectora
    }

    jump() {
        if (!this.inAir)
            this.triggerjump = true;
    }

    checkIfGravityNeedsToBeScaled() {
        let contactList = this.rigidBody.getContactLinkList()
        if (contactList) {
            let objTab = []
            objTab.push(contactList.getOther().three);
            let next = contactList.getNext()
            while (next) {
                objTab.push(next.getOther().three);
                next = next.getNext()
            }


            let vect = this.model.container.position.clone();
            vect.y += 0.5
            let vec2 = OIMOtoThreeVec3(this.moveVec.scale(5))
            vect.add(vec2)

            this.raycaster.far = 5;

            this.raycaster.set(vect, new THREE.Vector3(0, -1, 0));
            let tab = this.raycaster.intersectObjects(objTab, true);
            if (!tab[0]) {
                vect = this.model.container.position.clone();
                vect.y += 0.5
                vec2 = OIMOtoThreeVec3(this.moveVec.scale(5)).negate()
                vect.add(vec2)
                this.raycaster.set(vect, new THREE.Vector3(0, -1, 0));
                tab = this.raycaster.intersectObjects(objTab, true);
            }

            if (tab[0] && tab[0].distance < 5) {
                this.inAir = false;
                this.rigidBody.setGravityScale(1)
            }
            else {
                this.inAir = true;
                this.rigidBody.setGravityScale(10)
            }
        } else {
            this.inAir = true;
            this.rigidBody.setGravityScale(10)
        }
    }

    moveForward() {
        this.forward = true;
        let vector = THREEtoOimoVec(this.rotation)
        this.moveVec.addEq(vector)
        this.moveVec.normalize();

    }

    moveBackward() {
        this.backward = true;
        let vector = this.rotation;
        vector.applyEuler(new THREE.Euler(0, Math.PI, 0))
        this.moveVec.addEq(THREEtoOimoVec(vector))
        this.moveVec.normalize();
    }

    moveLeft() {
        this.left = true;
        let vector = this.rotation;
        vector.applyEuler(new THREE.Euler(0, Math.PI / 2, 0))
        this.moveVec.addEq(THREEtoOimoVec(vector))
        this.moveVec.normalize();
    }

    moveRight() {
        this.right = true;
        let vector = this.rotation;
        vector.applyEuler(new THREE.Euler(0, -Math.PI / 2, 0))
        this.moveVec.addEq(THREEtoOimoVec(vector))
        this.moveVec.normalize();
    }

    shootRay() {

        let dir = new THREE.Vector3();
        dir.setFromMatrixPosition(this.crossHairHelper.cross.container.matrixWorld);
        dir.sub(GM.camera.position.clone())
        dir.normalize();

        this.raycaster.far = 60;
        this.raycaster.set(GM.camera.position.clone(), dir)

        if (this.debugRaycater)
            GM.scene.add(new THREE.ArrowHelper(this.raycaster.ray.direction, this.raycaster.ray.origin, 60, Math.random() * 0xffffff));
        let tab = this.raycaster.intersectObjects(GM.specialTilesHandler.getRayCastArray(), true);
        this.bindedCube = null;
        if (tab[0] && tab[0].object.accessToClass.isMobile)
            this.bindedCube = tab[0].object;
        else if (tab[0] && tab[0].object.accessToClass.activeRaycaster) {
            tab[0].object.accessToClass.fullFill();

        }


    }

    moveCube(isMBPressed) {
        if (isMBPressed && this.bindedCube && GM.netHandler.getMobileCube().id != this.bindedCube.accessToClass.id) {
            let vec = new THREE.Vector3();
            vec.setFromMatrixPosition(this.crossHairHelper.cross.container.matrixWorld);
            vec.sub(GM.camera.position.clone()).normalize().multiplyScalar(40);
            let vec2 = GM.camera.position.clone();
            vec2.add(vec)

            GM.netHandler.addMobileCube(this.bindedCube.accessToClass.id, vec2)
            this.bindedCube.accessToClass.setPositionRB(THREEtoOimoVec(vec2))

        } else {
            this.bindedCube = null;
        }
    }


}

