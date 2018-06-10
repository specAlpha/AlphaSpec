class Character {
    constructor(positionVector3, Euler) {
        this.model = new Model(positionVector3, Euler)
        this.position = positionVector3;
        this.rigidBody = new OIMO.RigidBody({
            type: 1,
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

            this.model.container.position.set(p.position.x, p.position.y, p.position.z)
            if (this.model.currentAnimation != p.animation)
                this.model.setAnimation(p.animation)

        }
    }
}