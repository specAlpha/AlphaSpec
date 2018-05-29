class TextureBank {
    constructor() {
        this.textures = [];
    }

    createMaterial(textureName, repeatX, repeatY) {
        //TODO Po dodaniu świateł zmienic typ materiału

        let texture = this.textures[textureName].clone();
        texture.needsUpdate = true;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeatX, repeatY)
        texture.needsUpdate = true;


        let material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            opacity: 1
        });
        return material;
    }

    loadTextures(json) {
        for (let txt of json) {
            this.textures[txt.name] = new THREE.TextureLoader().load(txt.path);
        }
    }
}