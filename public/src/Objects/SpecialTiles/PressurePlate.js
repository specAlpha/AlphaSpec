class PressurePlate extends SpecialTile {
    constructor(positionVector3, Euler, id, eventsArr) {
        super(positionVector3, Euler, id, eventsArr, true, true);

        this.geometries[0] = new THREE.BoxGeometry(20, 5, 20);
        this.materials[0] = GM.textureBank.createMaterial('default', 1, 1);
        this.meshes[0] = new THREE.Mesh(this.geometries[0], this.materials[0]);
        this.geometries[1] = new THREE.BoxGeometry(15, 5, 15);
        this.materials[1] = GM.textureBank.createMaterial('defaultmotion', 1, 1);
        this.meshes[1] = new THREE.Mesh(this.geometries[1], this.materials[1]);
        this.meshes[1].position.y = 2.5;
        this.boundingBox = new THREE.Box3().setFromObject(this.meshes[1]);
        this.boundingBox.expandByVector(new THREE.Vector3(0, 3, 0));
        this.addMeshesToConainer()
        this.container.updateMatrixWorld();
        let dir = new THREE.Vector3();
        dir.setFromMatrixPosition(this.meshes[1].matrixWorld);
        this.boundingBox.translate(dir)

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
            geometry: new OIMO.BoxGeometry(new OIMO.Vec3(10, 2.5, 10)),
            friction: 1,
            restitution: 1,
            rotation: new OIMO.Mat3(),
            position: new OIMO.Vec3(),

        }))
        this.rigidBody.addShape(new OIMO.Shape({
            collisionGroup: 1,
            collisionMask: 1,
            density: 1,
            geometry: new OIMO.BoxGeometry(new OIMO.Vec3(7.5, 3, 7.5)),
            friction: 1,
            restitution: 1,
            rotation: new OIMO.Mat3(),
            position: new OIMO.Vec3(),

        }))

        GM.physics.world.addRigidBody(this.rigidBody);

        //for optimalisation
        this.bindedCube = null;
        this.bindedCubeVect = new THREE.Vector3();
        this.fullfilled = false;

    }

    update() {
        console.log(this.bindedCube)
        if (!(this.bindedCube && this.bindedCubeVect.distanceTo(this.bindedCube.container.position.clone()) < 2)) {
            if (this.bindedCube)
                this.bindedCube.pressurePlate = null;
            if (GM.characters.player1) {
                if (this.checkBoundingBox(GM.characters.player1.model))
                    return
            }
            if (GM.characters.player2) {
                if (this.checkBoundingBox(GM.characters.player2.model))
                    return
            }

            for (let cube of GM.specialTilesHandler.mobileCubes) {
                if (this.checkBoundingBox(cube)) {
                    cube.pressurePlate = this;
                    return
                }
            }


            if (this.fullfilled) {
                this.cancel()
                this.fullfilled = false;
                this.meshes[1].position.y = 2.5;
            }


        }
    }


    checkBoundingBox(object) {
        if (this.boundingBox.intersectsBox(object.boundingBox)) {
            this.bindedCube = object;
            this.bindedCubeVect = object.container.position.clone();
            this.meshes[1].position.y = .5;
            this.fullfilled = true;
            this.fullFill()
            console.log('intersect')
            return true;


        }
    }


}