class Ramp extends Component {
    constructor(positionVector3, sizeVector3, Euler, textureName) {
        super(positionVector3, Euler);
        this.size = sizeVector3;


        var shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(this.size.y, this.size.x);
        shape.lineTo(this.size.y, 0);
        shape.lineTo(0, 0);

        var extrudeSettings = {
            steps: 1,
            amount: this.size.z,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            bevelSegments: 2
        };


        this.geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        this.material = GM.textureBank.createMaterial(textureName, 0.1, 0.1)


        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.container.add(this.mesh)
    }
}