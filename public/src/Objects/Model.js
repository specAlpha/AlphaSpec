class Model extends Component {
    constructor(positionVector3, sizeVector3, Euler, url) {
        super(positionVector3, Euler);
        this.size = sizeVector3;
        this.mixer;
        this.loadModel(url)
    }

    loadModel(url, callback) {
        let that = this;
        let loader = new THREE.FBXLoader();
        loader.load(url, function (object) {

            that.mixer = new THREE.AnimationMixer(object);

            that.mixer.clipAction(object.animations[0]).play();

            object.traverse(function (child) {

                if (child.isMesh) {

                    child.castShadow = true;
                    child.receiveShadow = true;

                }

            });

            that.mesh = object;
            that.container.add(that.mesh)
            that.mesh.scale.set(0.1, 0.1, 0.1);
        });
    }

    update(deltaTime) {
        if (this.mixer)
            this.mixer.update(deltaTime)
    }
}