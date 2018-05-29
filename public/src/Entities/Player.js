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
        this.rigidBody.setGravityScale(10)

        this.rigidBody.setRotationFactor(new OIMO.Vec3(0, 0, 0))
        GM.physics.world.addRigidBody(this.rigidBody);

    }

    update(deltaTime) {
        this.checkIfGravityNeedsToBeScaled();

        super.update(deltaTime)

        this.move();
        if (this.triggerjump) {
            console.log('jump')
            this.triggerjump = false;
            this.rigidBody.addLinearVelocity(new OIMO.Vec3(0, 300, 0))
        }
        let posVect = OIMOtoThreeVec3(this.rigidBody.getPosition());
        this.model.container.position.set(posVect.x, posVect.y, posVect.z)
    }

    move() {

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


}

