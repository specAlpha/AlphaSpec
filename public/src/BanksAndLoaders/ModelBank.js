class ModelBank {
    constructor() {
        this.models = [];
        this.animations = [];
    }

    loadModel(url, isAnimation, name) {
        return new Promise(resolve => {

            let loader = new THREE.FBXLoader();
            GM.UI.addProgress();
            loader.load(url, (object) => {
                if (isAnimation) {
                    object.animations[0].name = name
                    this.animations.push(object.animations[0])
                } else {
                    this.models.push(object)
                }

                resolve(object)

            })

        })


    }

    loadFromJSON(json) {
        let modelPromiseArr = []
        let animPromiseArr = []

        for (let model of json.models) {
            modelPromiseArr.push(this.loadModel('/models/' + model + '.fbx', false, model))
        }
        for (let animation of json.animations) {
            animPromiseArr.push(this.loadModel('/models/animations/' + animation + '.fbx', true, animation))
        }
        return new Promise(resolve => {
            Promise.all([Promise.all(modelPromiseArr), Promise.all(animPromiseArr)]).then(arr => {

                this.combaine()

                resolve()
            })
        })

    }

    combaine() {
        console.log(this.models)
        console.log(this.animations)
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