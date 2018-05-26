class Plane extends Component {
    constructor(positionVector3, sizeVector3, Euler, textureName) {
        super(positionVector3, Euler);
        this.size = sizeVector3;
        this.geometry = new THREE.PlaneGeometry(this.size.x, this.size.y, 10);
        this.material = GM.textureBank.createMaterial(textureName, this.size.x / 10, this.size.y / 10);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.container.add(this.mesh)
    }
}