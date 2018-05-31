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
        this.rayCastArray.push(tile.container)
    }

    updateMobileCubes() {
        for (let cube of this.mobileCubes) {
            cube.update();
        }
    }

    updateSpecialTiles() {
        for (let tile of this.specialTiles) {
            tile.update();
        }
    }

    update() {
        this.updateMobileCubes();
        this.updateSpecialTiles()
    }

    getRayCastArray() {
        return this.rayCastArray;
    }


}