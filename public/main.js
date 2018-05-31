// TODO make it work

function OIMOtoThreeVec3(OimoVec) {
    return new THREE.Vector3(OimoVec.x, OimoVec.y, OimoVec.z)

}

function THREEtoOimoVec(vec) {
    return new OIMO.Vec3(vec.x, vec.y, vec.z)

}

function OIMOtoThreeQuat(quat) {
    return new THREE.Quaternion(quat.x, quat.y, quat.z, quat.w)

}


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
    let inputManager, kostka, spawner, button, event;


    $("#root").append(GM.renderer.domElement);
    loadJSON('/JSON/textures.json').then(function (json) {

        GM.textureBank.loadTextures(json.textures)

        //bedzie trzeba jakis loader porzadny napisac by tekstury sie wgrały a dopiero potem to leciał bo pozniej sra bugami

        setTimeout(function () {
            ramp = new Ramp(new THREE.Vector3(0, 0, 0), new THREE.Vector3(30, 30, 10), new THREE.Euler(0, 3.14, 0, 'XYZ'), 'default')
            cube = new Cube(new THREE.Vector3(-45, 15, -15), new THREE.Vector3(30, 30, 30), new THREE.Euler(0, 3.14, 0, 'XYZ'), 'default')
            player = new Player(new THREE.Vector3(20, 0, 20), new THREE.Euler(0, 0, 0, 'XYZ'), 'models/runTest.fbx')
            floor = new Cube(new THREE.Vector3(0, -1, 0), new THREE.Vector3(400, 2, 400), new THREE.Euler(0, 3.14, 0, 'XYZ'), 'default')

            ramp.addParentContainer(scene)
            player.model.addParentContainer(scene)
            cube.addParentContainer(scene)
            event = new Event();

            userInput.initKeyboard()
            userInput.initMouse()
            floor.addParentContainer(scene)
            spawner = new MobileCubeSpawner(new THREE.Vector3(50, 60, 0), new THREE.Euler(0, 0, 0, 'XYZ'), '#10', [event]);
            spawner.addParentContainer(scene)
            button = new Button(new THREE.Vector3(-45, 15, 1.5), new THREE.Euler(0, -Math.PI / 2, Math.PI / 2, 'XYZ'), '#11', [event]);
            button.addParentContainer(scene)
            GM.specialTilesHandler.addSpecialTile(spawner);
            GM.specialTilesHandler.addSpecialTile(button);
            loadJSON('/JSON/Keybinds.json').then(function (json) {
                inputManager = new InputManager(json, player, userInput)
                userInput.setPointerLock(GM.renderer.domElement)
                render();
            })

        }, 1000)


    })

    let clock = new THREE.Clock();

    function render() {

        let timeDelta = clock.getDelta();
        GM.physics.world.step(timeDelta)

        if (player) {
            inputManager.update()
            player.update(timeDelta)
            inputManager.postUpdate();
            GM.specialTilesHandler.update();

        }


        GM.renderer.render(scene, GM.camera);
        requestAnimationFrame(render);
    }


})