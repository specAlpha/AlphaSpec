class Model extends Component {
    constructor(positionVector3, Euler, url) {
        super(positionVector3, Euler);
        this.mixer;

        this.debuggeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
        this.debugmaterial = new THREE.MeshNormalMaterial({opacity: 1, transparent: true});
        this.debugmesh = new THREE.Mesh(this.debuggeometry, this.debugmaterial);
        this.debugmesh.position.y = 10;

        //  this.container.add(this.debugmesh);


        this.boundingMaterial = new THREE.MeshNormalMaterial({opacity: 0, transparent: true});
        this.boundingMesh = new THREE.Mesh(this.debuggeometry, this.boundingMaterial);
        this.container.add(this.boundingMesh);
        this.boundingMesh.position.y = 10;
        this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
        this.boundingBoxVect = new THREE.Vector3();
        this.boundingBox.setFromObject(this.debugmesh);


        this.loadModel(url)
    }

    loadModel(url, callback) {

        let loader = new THREE.FBXLoader();
        loader.load(url, (object) => {

            this.mixer = new THREE.AnimationMixer(object);

            this.mixer.clipAction(object.animations[0]).play();

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


        });
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
}