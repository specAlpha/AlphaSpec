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
        let mob = GM.netHandler.getMobileCube();

        if (mob) {

            let cube = this.findMobileCubeByID(mob.id)
            if (cube)
                cube.setPositionRB(new OIMO.Vec3(mob.position.x, mob.position.y, mob.position.z))
        }
    }

    findMobileCubeByID(id) {
        for (let cube of this.mobileCubes) {
            console.log(cube.id)
            if (cube.id == id)
                return cube
        }
    }

    updateSpecialTiles(deltaTime) {
        for (let tile of this.specialTiles) {
            tile.update(deltaTime);
        }
        let a = GM.netHandler.getEvents();

        for (let id of a) {
            GM.lvl.findByID(id).fullFill(false)
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