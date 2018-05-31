class TextureBank {
    constructor() {
        this.textures = [];
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

    loadTextures(json) {
        for (let txt of json) {
            this.textures[txt.name] = new THREE.TextureLoader().load(txt.path);
        }
    }
}