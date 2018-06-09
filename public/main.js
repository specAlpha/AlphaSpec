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


    scene.background = new THREE.Color(0xa0a0a0);

    /*
        var spotLight = new THREE.SpotLight(0x404040, 5, 1000, Math.PI / 4);
        spotLight.position.set(300, 300, 300);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 4096;
        spotLight.shadow.mapSize.height = 4096;
        var spotLightHelper = new THREE.SpotLightHelper(spotLight);
        scene.add(spotLightHelper);


        scene.add(spotLight);
        */

    light = new THREE.AmbientLight(0x404040, 2); // soft white light
    scene.add(light);
    var axes = new THREE.AxesHelper(1000)
    scene.add(axes)

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(200, 200, 200)
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 10000;  // default
    directionalLight.shadow.mapSize.height = 10000; // default

    directionalLight.shadowCameraLeft = -1000;
    directionalLight.shadowCameraRight = 1000;

    directionalLight.shadowCameraTop = 1000;
    directionalLight.shadowCameraBottom = -1000;
    var helper = new THREE.DirectionalLightHelper(directionalLight, 5);

    scene.add(helper);
    scene.add(directionalLight);

    let userInput = new UserInput();
    let inputManager, kostka, spawner, button, event, pressurePlate, doors, event2, pressurePlate2, event3, movecube,
        eventhandler, spaceevent;


    $("#root").append(GM.renderer.domElement);

    loadJSON('/JSON/textures.json').then(function (json) {

        GM.textureBank.load(json)

        //bedzie trzeba jakis loader porzadny napisac by tekstury sie wgrały a dopiero potem to leciał bo pozniej sra bugami

        setTimeout(function () {
            loadJSON('/JSON/Level.json').then(function (json) {
                GM.lvl.createLevel(json)
            })


            player = new Player(new THREE.Vector3(20, 0, 20), new THREE.Euler(0, 0, 0, 'XYZ'), 'models/runTest.fbx')


            GM.assignPlayers(player, null)


            player.model.addParentContainer(scene)

            userInput.initKeyboard()
            userInput.initMouse()


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
            GM.eventHandler.update(timer);
            GM.specialTilesHandler.update(timer);
            GM.UI.update(timer)

        }


        GM.renderer.render(scene, GM.camera);
        requestAnimationFrame(render);
    }


})