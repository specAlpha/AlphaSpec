// TODO make it work


$(function () {

    function loadJSON(url) {
        return fetch(url).then(resolve => resolve.json())

    }


    let controls, light;


    let scene;

    scene = GM.scene;
    let floor, cube, ramp, player


    GM.renderer = new THREE.WebGLRenderer();

    GM.renderer.setSize(window.innerWidth, window.innerHeight);


    GM.renderer.setSize($(window).width(), $(window).height());
    GM.camera.position.set(50, 50, 50)
    GM.camera.lookAt(scene.position)
    GM.renderer.shadowMap.enabled = true;
    GM.renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    //controls = new THREE.OrbitControls(GM.camera);

    //controls.update();

    scene.background = new THREE.Color(0xa0a0a0);
    // scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);


    var spotLight = new THREE.SpotLight(0x404040, 5, 1000, Math.PI / 4);
    spotLight.position.set(300, 300, 300);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 4096;
    spotLight.shadow.mapSize.height = 4096;
    var spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);


    scene.add(spotLight);
    light = new THREE.AmbientLight(0x404040, 2); // soft white light
    scene.add(light);
    var axes = new THREE.AxesHelper(1000)
    scene.add(axes)


    let userInput = new UserInput();
    let inputManager, kostka, spawner, button, event, pressurePlate, doors, event2, pressurePlate2, event3, movecube,
        eventhandler, spaceevent;


    $("#root").append(GM.renderer.domElement);
    loadJSON('/JSON/textures.json').then(function (json) {

        GM.textureBank.load(json)

        //bedzie trzeba jakis loader porzadny napisac by tekstury sie wgrały a dopiero potem to leciał bo pozniej sra bugami

        setTimeout(function () {
            eventhandler = new EventHandler();
            ramp = new Ramp(new THREE.Vector3(0, 0, 0), new THREE.Vector3(30, 30, 30), new THREE.Euler(0, 3.14, 0, 'XYZ'), 'default')
            cube = new Cube(new THREE.Vector3(-45, 15, -15), new THREE.Vector3(30, 30, 30), new THREE.Euler(0, 3.14, 0, 'XYZ'), 'default')
            cube.addParentContainer(scene)
            cube = new Cube(new THREE.Vector3(-45, 15, 55), new THREE.Vector3(30, 30, 30), new THREE.Euler(0, 3.14, 0, 'XYZ'), 'default')
            cube.addParentContainer(scene)
            player = new Player(new THREE.Vector3(20, 0, 20), new THREE.Euler(0, 0, 0, 'XYZ'), 'models/runTest.fbx')
            floor = new Cube(new THREE.Vector3(0, -1, 0), new THREE.Vector3(400, 2, 400), new THREE.Euler(0, 3.14, 0, 'XYZ'), 'default')
            spaceevent = new SpaceEvent(new THREE.Vector3(30, 5, -80), new THREE.Vector3(40, 50, 40), 'test')
            GM.assignPlayers(player, null)
            ramp.addParentContainer(scene)
            eventhandler.addSpaceEvent(spaceevent)
            player.model.addParentContainer(scene)
            event2 = new Event();
            event3 = new Event();
            pressurePlate = new PressurePlate(new THREE.Vector3(50, 0, 0), new THREE.Euler(0, 0, 0, 'XYZ'), '#12', [event2])
            pressurePlate2 = new PressurePlate(new THREE.Vector3(50, 0, 40), new THREE.Euler(0, 0, 0, 'XYZ'), '#13', [event3])
            event = new Event();
            movecube = new DynamicCube(new THREE.Vector3(75, 15, 55), new THREE.Vector3(30, 30, 30), new THREE.Euler(0, 3.14, 0, 'XYZ'), '#43', 'z', 110, [[event3]])
            doors = new Doors(new THREE.Vector3(-120, 0, 5), new THREE.Euler(0, 0, 0, 'XYZ'), '#13', [[event2]]);
            userInput.initKeyboard()
            userInput.initMouse()
            floor.addParentContainer(scene)
            spawner = new MobileCubeSpawner(new THREE.Vector3(50, 60, 0), new THREE.Euler(0, 0, 0, 'XYZ'), '#10', [[event]]);
            spawner.addParentContainer(scene)
            button = new Button(new THREE.Vector3(-45, 15, 1), new THREE.Euler(0, -Math.PI / 2, Math.PI / 2, 'XYZ'), '#11', [event]);
            button.addParentContainer(scene)
            pressurePlate.addParentContainer(scene)
            pressurePlate2.addParentContainer(scene)
            movecube.addParentContainer(scene)
            doors.addParentContainer(scene)
            GM.specialTilesHandler.addSpecialTile(spawner);
            GM.specialTilesHandler.addSpecialTile(pressurePlate);
            GM.specialTilesHandler.addSpecialTile(pressurePlate2);
            GM.specialTilesHandler.addSpecialTile(button);
            GM.specialTilesHandler.addSpecialTile(doors);
            GM.specialTilesHandler.addSpecialTile(movecube);
            loadJSON('/JSON/Keybinds.json').then(function (json) {
                inputManager = new InputManager(json, player, userInput)
                userInput.setPointerLock(GM.renderer.domElement)
                render();
            })

        }, 1000)


    })


    function render() {
        let threeTimer = GM.clock.getThreeTimer()
        let timer = GM.clock.getTimer()

        GM.physics.world.step(0.016)

        if (player) {
            inputManager.update()
            player.update(threeTimer)
            inputManager.postUpdate();
            eventhandler.update();
            GM.specialTilesHandler.update(timer);
            GM.UI.update(timer)

        }


        GM.renderer.render(scene, GM.camera);
        requestAnimationFrame(render);
    }


})