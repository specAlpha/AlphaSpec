class Level {
    constructor() {
        this.specialTiles = [];
        this.staticTiles = [];
        this.json = null;

    }

    createLevel(json) {
        this.json = json;
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

        let obj = new WinTile();
        this.specialTiles.push(obj);
        GM.specialTilesHandler.addSpecialTile(obj)


        for (let e of json.events.spaceEvents) {
            this.createSpaceEvent(e.position, e.size, e.image)
        }
        for (let e of json.events.blockEvents) {
            this.createBlockEvent(e.type, e.emmiter, e.receiver, e.wires)
        }
        this.createLights(2000, 16384)

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

    createLights(mapSize, shadowSize) {

        this.ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light


        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.directionalLight.position.set(55, 120, 0)
        this.lightTarget = new THREE.Object3D();
        this.lightTarget.position.set(85, 0, 0)
        this.directionalLight.target = this.lightTarget
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = shadowSize;  // default
        this.directionalLight.shadow.mapSize.height = shadowSize; // default

        this.directionalLight.shadow.camera.left = -mapSize;
        this.directionalLight.shadow.camera.right = mapSize;

        this.directionalLight.shadow.camera.bottom = -mapSize;
        this.directionalLight.shadow.camera.top = mapSize;
        GM.scene.add(this.directionalLight)
        GM.scene.add(this.ambientLight)
        GM.scene.add(this.lightTarget)

    }

    createPlayer(pos, rot, pos2, rot2) {

        this.player1 = new Player(new THREE.Vector3(pos.x, pos.y, pos.z), new THREE.Euler(rot.x, rot.y, rot.z, 'XYZ'))
        this.player2 = new Character(new THREE.Vector3(pos2.x, pos2.y, pos2.z), new THREE.Euler(rot2.x, rot2.y, rot2.z, 'XYZ'))
        GM.inputManager.setPlayer(this.player1)
        this.player1.model.addParentContainer(GM.scene)
        this.player2.model.addParentContainer(GM.scene)
        this.player1.model.loadModel(GM.playerID)

        if (GM.playerID == 0)
            this.player2.model.loadModel(1)
        else
            this.player2.model.loadModel(0)
        GM.assignPlayers(this.player1, this.player2)
    }

    spawnPlayers() {
        if (GM.playerID == 0)
            this.createPlayer(this.json.spawn.player0.position, this.json.spawn.player0.rotation, this.json.spawn.player1.position, this.json.spawn.player1.rotation)
        else
            this.createPlayer(this.json.spawn.player1.position, this.json.spawn.player1.rotation, this.json.spawn.player0.position, this.json.spawn.player0.rotation)
    }

}