class Character {
    constructor(positionVector3, Euler) {
        this.model = new Model(positionVector3, Euler)
        this.position = positionVector3;
        this.rigidBody = new OIMO.RigidBody({
            type: 0,
            angularDamping: 1,
            linearDamping: 1,
            angularVelocity: new OIMO.Vec3(),
            position: THREEtoOimoVec(positionVector3),
            linearVelocity: new OIMO.Vec3(),
            autoSleep: false,
            rotation: new OIMO.Mat3(),

        })
        this.rigidBody.three = this.model.container;


        this.rigidBody.addShape(new OIMO.Shape({
            collisionGroup: 1,
            collisionMask: 1,
            density: 100,
            geometry: new OIMO.CylinderGeometry(5, 10),
            friction: 20,
            restitution: 0,
            rotation: new OIMO.Mat3(),
            position: new OIMO.Vec3(0, 10, 0),

        }))

        this.rigidBody.setRotationFactor(new OIMO.Vec3(0, 0, 0))
        GM.physics.world.addRigidBody(this.rigidBody);
    }

    update(deltaTime) {

        this.model.update(deltaTime)
    }

    updatePacket() {


        let p = GM.netHandler.getCharacter()
        if (p) {
            this.model.container.rotation.y = p.rotation;

            this.rigidBody.setPosition(new OIMO.Vec3(p.position.x, p.position.y, p.position.z))
            if (this.model.currentAnimation != p.animation)
                this.model.setAnimation(p.animation)

        }
        let posVect = OIMOtoThreeVec3(this.rigidBody.getPosition());
        this.model.container.position.set(posVect.x, posVect.y, posVect.z)

    }
}