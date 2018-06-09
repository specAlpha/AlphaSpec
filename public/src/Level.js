class Level {
    constructor() {
        this.specialTiles = [];
        this.staticTiles = [];
        this.playerLocal = null;
        this.playerInternet = null;


    }

    createLevel(json) {

        for (let staticTypes in json.staticBlocks) {
            for (let tile of json.staticBlocks[staticTypes]) {
                this.createStaticBlock(staticTypes, tile.position, tile.size, tile.rotation, tile.texture)
            }
        }
        for (let specialTypes in json.specialTiles) {
            for (let tile of json.specialTiles[specialTypes]) {
                this.createSpecialTile(specialTypes, tile.position, tile.rotation, tile.id, tile.axis, tile.moveTo, tile.size)
            }
        }
        for (let e of json.events.spaceEvents) {
            this.createSpaceEvent(e.position, e.size, e.image)
        }
        for (let e of json.events.blockEvents) {
            this.createBlockEvent(e.type, e.emmiter, e.receiver, e.wires)
        }

    }

    createStaticBlock(type, pos, size, rot, texture) {
        let obj;
        if (type == 'ramp') {
            obj = new Ramp(new THREE.Vector3(pos.x, pos.y, pos.z), new THREE.Vector3(size.x, size.y, size.z), new THREE.Euler(rot.x, rot.y, rot.z), texture)
        }
        else if (type == 'cube') {
            obj = new Cube(new THREE.Vector3(pos.x, pos.y, pos.z), new THREE.Vector3(size.x, size.y, size.z), new THREE.Euler(rot.x, rot.y, rot.z), texture)
        }
        else {
            obj = new Plane(new THREE.Vector3(pos.x, pos.y, pos.z), new THREE.Vector3(size.x, size.y, size.z), new THREE.Euler(rot.x, rot.y, rot.z), texture)
        }
        this.staticTiles.push(obj);
        obj.addParentContainer(GM.scene)
    }

    createSpecialTile(type, pos, rot, id, axis, moveTo, size) {
        let obj
        if (type == 'button') {
            obj = new Button(new THREE.Vector3(pos.x, pos.y, pos.z), new THREE.Euler(rot.x, rot.y, rot.z), id, [])
        }
        else if (type == 'doors') {
            obj = new Doors(new THREE.Vector3(pos.x, pos.y, pos.z), new THREE.Euler(rot.x, rot.y, rot.z), id, [])
        }
        else if (type == 'spawner') {
            obj = new MobileCubeSpawner(new THREE.Vector3(pos.x, pos.y, pos.z), new THREE.Euler(rot.x, rot.y, rot.z), id, [])
        }
        else if (type == 'pressurePlate') {
            obj = new PressurePlate(new THREE.Vector3(pos.x, pos.y, pos.z), new THREE.Euler(rot.x, rot.y, rot.z), id, [])
        }
        else {
            obj = new DynamicCube(new THREE.Vector3(pos.x, pos.y, pos.z), new THREE.Vector3(size.x, size.y, size.z), new THREE.Euler(rot.x, rot.y, rot.z), id, axis, moveTo, [])
        }
        this.specialTiles.push(obj);
        obj.addParentContainer(GM.scene)
        GM.specialTilesHandler.addSpecialTile(obj)
    }

    createSpaceEvent(pos, size, img) {
        let event = new SpaceEvent(new THREE.Vector3(pos.x, pos.y, pos.z), new THREE.Vector3(size.x, size.y, size.z), img)
        GM.eventHandler.addSpaceEvent(event)
    }

    createBlockEvent(type, emmiter, receiver, wires) {
        let event = new Event(type);
        event.setEmmiter(this.findByID(emmiter))
        event.setReceiver(this.findByID(receiver))
        for (let wire of wires) {
            event.createWire(wire)
        }
        GM.eventHandler.addEvent(event)

    }

    findByID(id) {
        for (let tile of this.specialTiles) {
            if (id == tile.id)
                return tile
        }


    }


}