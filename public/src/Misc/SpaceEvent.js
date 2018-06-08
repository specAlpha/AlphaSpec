class SpaceEvent {
    constructor(positionVec, sizeVec, img) {
        this.img = img;

        this.boundingBox = new THREE.Box3().setFromCenterAndSize(positionVec, sizeVec)


        this.complete = false;
       
    }

    update() {
        if (GM.characters.player1) {
            if (this.boundingBox.intersectsBox(GM.characters.player1.model.boundingBox)) {
                this.complete = true;
            }
        }
    }

}