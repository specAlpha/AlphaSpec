class Model extends Component {
    constructor(positionVector3, Euler) {
        super(positionVector3, Euler);
        this.mixer;

        this.debuggeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
        this.debugmaterial = new THREE.MeshNormalMaterial({
            opacity: 0, transparent: true,
        });
        this.debugmesh = new THREE.Mesh(this.debuggeometry, this.debugmaterial);
        this.debugmesh.position.y = 10;

        //  this.container.add(this.debugmesh);


        this.boundingMaterial = new THREE.MeshNormalMaterial({opacity: 0, transparent: true, depthTest: false});
        this.boundingMesh = new THREE.Mesh(this.debuggeometry, this.boundingMaterial);
        this.container.add(this.boundingMesh);
        this.boundingMesh.position.y = 10.1;
        this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
        this.boundingBoxVect = new THREE.Vector3();
        this.boundingBox.setFromObject(this.debugmesh);
        this.currentAnimation = '';

    }

    loadModel(id) {

        let object = GM.modelBank.getModel(id)

        this.mixer = new THREE.AnimationMixer(object);
        this.setAnimation('Idle')

        object.traverse(function (child) {

            if (child.isMesh) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        });

        this.mesh = object;

        this.container.add(this.mesh)

        this.mesh.scale.set(0.1, 0.1, 0.1);
        this.mesh.position.y = 1;


    }

    update(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime)


            this.boundingBox.translate(this.boundingBoxVect)
            let dir = new THREE.Vector3();
            dir.setFromMatrixPosition(this.boundingMesh.matrixWorld);
            dir.y += -10;

            this.boundingBoxVect.copy(dir).negate();
            this.boundingBox.translate(dir)

        }

    }

    setAnimation(name) {
        console.log(this.currentAnimation)
        if (this.currentAnimation)
            this.stopAnimation(this.currentAnimation)
        this.currentAnimation = name;
        this.mixer.clipAction(name).play()
    }

    stopAnimation(name) {
        this.mixer.clipAction(name).stop()

    }
}