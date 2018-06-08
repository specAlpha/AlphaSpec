class TextureBank {
    constructor() {
        this.textures = {};
        this.images = {}

    }

    createMaterial(textureName, repeatX, repeatY) {


        let texture = this.textures[textureName].clone();
        texture.needsUpdate = true;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeatX, repeatY)
        texture.needsUpdate = true;


        let material = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.FrontSide,
            opacity: 1,
            specular: 0xffffff,
            shininess: 1,
        });
        return material;
    }

    createSprite(texturename) {

        let texture = this.textures[texturename].clone();
        texture.needsUpdate = true;
        let material = new THREE.SpriteMaterial({
            map: texture,


        });

        return material;
    }

    getImage(name) {
        return this.images[name];
    }

    loadImage(url) {
        return new Promise(resolve => {
            const image = new Image();
            image.addEventListener('load', () => {
                resolve(image)
            })
            image.src = url;
        })
    }

    load(json) {
        let txtPromieses = [];
        let imgPromieses = [];
        for (let txt of json.textures) {
            txtPromieses.push(this.loadImage(txt.path))
        }
        for (let img of json.images) {
            imgPromieses.push(this.loadImage(img.path))
        }
        Promise.all(txtPromieses).then((arr) => {

            for (let i = 0; i < json.textures.length; i++) {
                this.textures[json.textures[i].name] = new THREE.Texture(arr[i])
            }
        })
        Promise.all(imgPromieses).then((arr) => {

            for (let i = 0; i < json.images.length; i++) {
                this.images[json.images[i].name] = arr[i]
            }

        })


    }
}