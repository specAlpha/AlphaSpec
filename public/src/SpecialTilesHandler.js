class SpecialTilesHandler {
    constructor() {
        this.mobileCubes = [];
        this.specialTiles = [];
        this.rayCastArray = [];


    }

    addMobileCube(cube) {

        this.mobileCubes.push(cube)
        this.rayCastArray.push(cube.container)
    }

    addSpecialTile(tile) {
        this.specialTiles.push(tile)
        if (tile.emmiter)
            this.rayCastArray.push(tile.container)
    }

    updateMobileCubes() {
        for (let cube of this.mobileCubes) {
            cube.update();
        }
    }

    updateSpecialTiles(deltaTime) {
        for (let tile of this.specialTiles) {
            tile.update(deltaTime);
        }
    }

    update(deltaTime) {
        this.updateMobileCubes();
        this.updateSpecialTiles(deltaTime)
    }

    getRayCastArray() {
        return this.rayCastArray;
    }

    removeMobileCube(cube) {
        this.mobileCubes.splice(this.mobileCubes.indexOf(cube), 1)
        this.rayCastArray.splice(this.rayCastArray.indexOf(cube.container), 1)
    }

}