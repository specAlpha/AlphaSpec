class Cube extends Component {
    constructor(positionVector3, sizeVector3, Euler, textureNames) {
        super(positionVector3, Euler);
        this.size = sizeVector3;
        this.geometry = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);
        this.materials = []

//Jak kostka składa sie z tych samych ścian to nie trzeba pisać wszytkich 6
        if (textureNames.length == 1) {
            for (let i = 0; i < 6; i++) {
                this.materials.push(GM.textureBank.createMaterial(textureNames[0], this.size.x / 10, this.size.y / 10));
            }
        }
        else {
            for (name of textureNames) {
                this.materials.push(GM.textureBank.createMaterial(name, this.size.x / 10, this.size.y / 10));
            }
        }

        this.mesh = new THREE.Mesh(this.geometry, this.materials);
        this.container.add(this.mesh)
    }
}