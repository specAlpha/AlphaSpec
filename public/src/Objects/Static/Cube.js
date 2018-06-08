class Cube extends Component {
    constructor(positionVector3, sizeVector3, Euler, textureName) {
        super(positionVector3, Euler);
        this.size = sizeVector3;
        this.geometry = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);

        this.material = GM.textureBank.createMaterial(textureName, this.size.x / 10, this.size.z / 10);
        this.rigidBody = new OIMO.RigidBody({
            type: 1,
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
            density: 1,
            geometry: new OIMO.BoxGeometry(new OIMO.Vec3(this.size.x / 2, this.size.y / 2, this.size.z / 2)),
            friction: 1,
            restitution: 1,
            rotation: new OIMO.Mat3(),
            position: new OIMO.Vec3(),

        }))
        GM.physics.world.addRigidBody(this.rigidBody);


        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.castShadow = true
        this.mesh.receiveShadow = true

        this.container.add(this.mesh)
    }


}