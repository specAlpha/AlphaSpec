class Ramp extends Component {
    constructor(positionVector3, sizeVector3, Euler, textureName) {
        super(positionVector3, Euler);
        this.size = sizeVector3;


        var shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(this.size.x, this.size.y);
        shape.lineTo(this.size.x, 0);
        shape.lineTo(0, 0);

        var extrudeSettings = {
            steps: 1,
            amount: this.size.z,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            bevelSegments: 2
        };


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

        let collisionRot = new OIMO.Mat3();
        collisionRot.fromEulerXyz(new OIMO.Vec3(0, Math.PI, Math.PI / 4))
        this.rigidBody.addShape(new OIMO.Shape({
            collisionGroup: 1,
            collisionMask: 1,
            density: 1,
            geometry: new OIMO.BoxGeometry(new OIMO.Vec3((this.size.x * Math.sqrt(2) + 1) / 2, 1, this.size.z / 2)),
            friction: 1,
            restitution: 1,
            rotation: collisionRot,
            position: new OIMO.Vec3(-this.size.x / 2, this.size.x / 2 - 1, -this.size.z / 2),

        }))
        GM.physics.world.addRigidBody(this.rigidBody);

        this.debuggeometry = new THREE.BoxGeometry((this.size.x * Math.sqrt(2)), 1, this.size.z);

        this.debugmaterial = new THREE.MeshNormalMaterial({opacity: 0.5, transparent: true});

        this.debugmesh = new THREE.Mesh(this.debuggeometry, this.debugmaterial);
        this.debugmesh.position.add(new THREE.Vector3(this.size.x / 2, this.size.x / 2, this.size.z / 2));
        this.debugmesh.setRotationFromEuler(new THREE.Euler(0, Math.PI, -Math.PI / 4));

        this.container.add(this.debugmesh)


        this.geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        this.material = GM.textureBank.createMaterial(textureName, 0.1, 0.1)


        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.container.add(this.mesh)
    }


}