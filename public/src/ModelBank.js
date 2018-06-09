class ModelBank {
    constructor() {
        this.models = [];
        this.animations = [];
    }

    loadModel(url, isAnimation, name) {


        let loader = new THREE.FBXLoader();
        loader.load(url, (object) => {
            if (isAnimation) {
                object.animations[0].name = name
                this.animations.push(object.animations[0])
            } else {
                this.models.push(object)
            }

        })
    }

    loadFromJSON(json) {

        for (let model of json.models) {
            this.loadModel('/models/' + model + '.fbx', false, model)
        }
        for (let animation of json.animations) {
            this.loadModel('/models/animations/' + animation + '.fbx', true, animation)
        }

    }

    combaine() {
        for (let model of this.models) {
            for (let animation of this.animations) {
                model.animations.push(animation)
            }
        }
    }

    getModel(id) {
        return this.models[id];
    }
}