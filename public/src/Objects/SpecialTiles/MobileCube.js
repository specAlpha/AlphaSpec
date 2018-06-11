class MobileCube extends Component {
    constructor(positionVector3, id) {
        super(positionVector3, new THREE.Euler(0, 0, 0));
        this.geometry = new THREE.BoxGeometry(10, 10, 10);
        this.isMobile = true;
        this.id = id;
        this.material = GM.textureBank.createMaterial('defaultmotion', 1, 1);
        this.rigidBody = new OIMO.RigidBody({
            type: 0,
            angularDamping: 1,
            linearDamping: 1,
            angularVelocity: new OIMO.Vec3(),
            position: THREEtoOimoVec(positionVector3),
            linearVelocity: new OIMO.Vec3(),
            autoSleep: true,
            rotation: new OIMO.Mat3(),

        })

        this.rigidBody.three = this.container;
        this.rigidBody.addShape(new OIMO.Shape({
            collisionGroup: 1,
            collisionMask: 1,
            density: 100,
            geometry: new OIMO.BoxGeometry(new OIMO.Vec3(5, 5, 5)),
            friction: 20,
            restitution: 0,
            rotation: new OIMO.Mat3(),
            position: new OIMO.Vec3(),

        }))
        GM.physics.world.addRigidBody(this.rigidBody);

        this.spawnProtection = new TimerHelper(0.5, 1)
        this.spawnProtection.running = true;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.accessToClass = this;
        this.mesh.receiveShadow = true
        this.mesh.castShadow = true
        this.pressurePlate = null;
        this.boundingBox = new THREE.Box3().setFromObject(this.mesh);
        this.boundingBoxVect = new THREE.Vector3();
        this.container.add(this.mesh)
    }

    update(time) {
        let posVect = OIMOtoThreeVec3(this.rigidBody.getPosition());
        let rotation = OIMOtoThreeQuat(this.rigidBody.getOrientation());
        this.container.setRotationFromQuaternion(rotation);
        this.container.position.set(posVect.x, posVect.y, posVect.z)
        this.container.updateMatrixWorld();
        this.boundingBox.translate(this.boundingBoxVect)
        let dir = new THREE.Vector3();
        dir.setFromMatrixPosition(this.mesh.matrixWorld);
        this.boundingBoxVect.copy(dir).negate();
        this.boundingBox.translate(dir)
        this.spawnProtection.update(time)
        if (this.spawnProtection.complete)
            this.spawnProtection.reset();

    }

    setPositionRB(oimoVector) {

        if (this.spawnProtection.running && !this.spawnProtection.complete)
            this.rigidBody.setPosition(oimoVector)
    }

    destroy() {
        GM.scene.remove(this.container)
        GM.specialTilesHandler.removeMobileCube(this)
        GM.physics.world.removeRigidBody(this.rigidBody);
        if (this.pressurePlate) {
            this.pressurePlate.bindedCube = null;
        }
    }


}