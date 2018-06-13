class MobileCubeSpawner extends SpecialTile {
    constructor(positionVector3, Euler, id, eventsArr) {
        super(positionVector3, Euler, id, eventsArr, false, true);

        this.cube = null;


        this.geometries[0] = new THREE.BoxGeometry(20, 10, 20);
        this.materials[0] = GM.textureBank.createMaterial('default', 1, 1);
        this.meshes[0] = new THREE.Mesh(this.geometries[0], this.materials[0]);
        this.geometries[1] = new THREE.CylinderGeometry(9, 7.1, 10, 32);
        this.materials[1] = GM.textureBank.createMaterial('defaultmotion', 1, 1);
        this.meshes[1] = new THREE.Mesh(this.geometries[1], this.materials[1]);
        this.meshes[1].position.y = -5;
        this.geometries[2] = new THREE.CylinderGeometry(7.1, 7.1, 5, 32);
        this.materials[2] = GM.textureBank.createMaterial('window', 1, 1);
        this.meshes[2] = new THREE.Mesh(this.geometries[2], this.materials[2]);
        this.meshes[2].position.y = -12.5
        this.addMeshesToConainer()
    }

    update() {


        if (this.checkEvents()) {

            this.spawnCube()
            this.resetEvents()
        }


    }

    spawnCube() {

        if (this.cube)
            this.cube.destroy();
        let cube = new MobileCube(this.container.position.clone(), this.id)
        cube.addParentContainer(GM.scene);
        GM.specialTilesHandler.addMobileCube(cube)
        this.cube = cube;

    }
}