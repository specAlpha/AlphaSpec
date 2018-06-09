class Button extends SpecialTile {
    constructor(positionVector3, Euler, id, eventsArr) {
        super(positionVector3, Euler, id, eventsArr, true, false);

        this.geometries[0] = new THREE.BoxGeometry(5, 2, 5);
        this.materials[0] = GM.textureBank.createMaterial('default', 1, 1);
        this.meshes[0] = new THREE.Mesh(this.geometries[0], this.materials[0]);
        this.geometries[1] = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
        this.materials[1] = GM.textureBank.createMaterial('defaultmotion', 1, 1);
        this.meshes[1] = new THREE.Mesh(this.geometries[1], this.materials[1]);
        this.meshes[1].position.y = -1.5;
        this.activeRaycaster = true;
        this.addMeshesToConainer()
    }

    fullFill(send = true) {
        if (this.id == 'win') {
            // TODO emmit win
        }
        else {
            super.fullFill();
            if (send)
                GM.netHandler.addEventToSend(this.id)
        }
    }

}