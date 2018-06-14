class Doors extends SpecialTile {
    constructor(positionVector3, Euler, id, eventsArr) {
        super(positionVector3, Euler, id, eventsArr, false, true);
        this.position = positionVector3;


        this.geometries[0] = new THREE.BoxGeometry(10, 30, 10);
        this.materials[0] = GM.textureBank.createMaterial('default', 1, 1);
        this.meshes[0] = new THREE.Mesh(this.geometries[0], this.materials[0]);
        this.meshes[1] = new THREE.Mesh(this.geometries[0], this.materials[0]);
        this.geometries[1] = new THREE.BoxGeometry(2, 30, 10);
        this.materials[1] = GM.textureBank.createMaterial('defaultmotion', 1, 1);
        this.meshes[2] = new THREE.Mesh(this.geometries[1], this.materials[1]);
        this.meshes[3] = new THREE.Mesh(this.geometries[1], this.materials[1]);
        this.meshes[0].position.y = 15;
        this.meshes[0].position.z = -15;
        this.meshes[1].position.z = 15;
        this.meshes[1].position.y = 15;
        this.meshes[2].position.y = 15;
        this.meshes[3].position.y = 15;
        this.meshes[2].position.z = -5;
        this.meshes[3].position.z = 5;
        this.rigidBodies = [];
        let oimoVec = THREEtoOimoVec(positionVector3)
        this.rigidBodies[0] = new OIMO.RigidBody({
            type: 1,
            angularDamping: 1,
            linearDamping: 1,
            angularVelocity: new OIMO.Vec3(),
            position: oimoVec,
            linearVelocity: new OIMO.Vec3(),
            autoSleep: true,
            rotation: new OIMO.Mat3()

        })


        this.rigidBodies[0].addShape(new OIMO.Shape({
            collisionGroup: 1,
            collisionMask: 1,
            density: 1,
            geometry: new OIMO.BoxGeometry(new OIMO.Vec3(5, 15, 5)),
            friction: 1,
            restitution: 1,
            rotation: new OIMO.Mat3(),
            position: new OIMO.Vec3(0, 15, -15),

        }))
        this.rigidBodies[0].addShape(new OIMO.Shape({
            collisionGroup: 1,
            collisionMask: 1,
            density: 1,
            geometry: new OIMO.BoxGeometry(new OIMO.Vec3(5, 15, 5)),
            friction: 1,
            restitution: 1,
            rotation: new OIMO.Mat3(),
            position: new OIMO.Vec3(0, 15, 15),

        }))

        this.rigidBodies[1] = new OIMO.RigidBody({
            type: 1,
            angularDamping: 1,
            linearDamping: 1,
            angularVelocity: new OIMO.Vec3(),
            position: THREEtoOimoVec(positionVector3),
            linearVelocity: new OIMO.Vec3(),
            autoSleep: true,
            rotation: new OIMO.Mat3(),

        })
        this.rigidBodies[1].addShape(new OIMO.Shape({
            collisionGroup: 1,
            collisionMask: 1,
            density: 1,
            geometry: new OIMO.BoxGeometry(new OIMO.Vec3(1, 15, 5)),
            friction: 1,
            restitution: 1,
            rotation: new OIMO.Mat3(),
            position: new OIMO.Vec3(0, 15, -5),

        }))


        this.rigidBodies[2] = new OIMO.RigidBody({
            type: 1,
            angularDamping: 1,
            linearDamping: 1,
            angularVelocity: new OIMO.Vec3(),
            position: THREEtoOimoVec(positionVector3),
            linearVelocity: new OIMO.Vec3(),
            autoSleep: true,
            rotation: new OIMO.Mat3(),

        })
        this.rigidBodies[2].addShape(new OIMO.Shape({
            collisionGroup: 1,
            collisionMask: 1,
            density: 1,
            geometry: new OIMO.BoxGeometry(new OIMO.Vec3(1, 15, 5)),
            friction: 1,
            restitution: 1,
            rotation: new OIMO.Mat3(),
            position: new OIMO.Vec3(0, 15, 5),

        }))

        this.rigidBodies[0].three = this.container;
        this.rigidBodies[1].three = this.container;
        this.rigidBodies[2].three = this.container;
        GM.physics.world.addRigidBody(this.rigidBodies[0]);
        GM.physics.world.addRigidBody(this.rigidBodies[1]);
        GM.physics.world.addRigidBody(this.rigidBodies[2]);
        this.closeDoorsPosition = [this.rigidBodies[1].getPosition(), this.rigidBodies[2].getPosition()]

        let vec = new THREE.Vector3(0, 15, -14.9).applyEuler(Euler)

        this.openedDoorsPosition = [THREEtoOimoVec(vec.add(this.container.position.clone())), THREEtoOimoVec(this.container.position.clone()).add(vec.negate())]
        this.opened = false;
        this.addMeshesToConainer()
        this.rigidBodies[0].rotateXyz(THREEtoOimoEuler(Euler))
        this.rigidBodies[1].rotateXyz(THREEtoOimoEuler(Euler))
        this.rigidBodies[2].rotateXyz(THREEtoOimoEuler(Euler))
    }

    update() {


        if (this.checkEvents()) {
            this.openDoors()

        }
        else if (this.opened) {
            this.closeDoors()
        }


    }

    openDoors() {

        this.meshes[2].position.z = -14.9;
        this.meshes[3].position.z = 14.9;

        this.rigidBodies[1].setPosition(this.openedDoorsPosition[0]);
        this.rigidBodies[2].setPosition(this.openedDoorsPosition[1]);
        this.opened = true;
    }

    closeDoors() {
        this.meshes[2].position.z = -5;
        this.meshes[3].position.z = 5;
        this.rigidBodies[1].setPosition(this.closeDoorsPosition[0]);
        this.rigidBodies[2].setPosition(this.closeDoorsPosition[1]);
        this.opened = false;
    }
}