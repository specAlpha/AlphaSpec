// TODO make it work

function OIMOtoThreeVec3(OimoVec) {
    return new THREE.Vector3(OimoVec.x, OimoVec.y, OimoVec.z)

}

function THREEtoOimoVec(vec) {
    return new OIMO.Vec3(vec.x, vec.y, vec.z)

}


$(function () {

    function loadJSON(url) {
        return fetch(url).then(resolve => resolve.json())

    }


    let controls, light;


    let scene, camera;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        45,
        $(window).width() / $(window).height(),
        0.1,
        10000
    );
    let floor, cube, ramp, player


    GM.renderer = new THREE.WebGLRenderer({antialias: true});
    GM.renderer.setPixelRatio(window.devicePixelRatio);
    GM.renderer.setSize(window.innerWidth, window.innerHeight);
    GM.renderer.shadowMap.enabled = true;


    GM.renderer.setSize($(window).width(), $(window).height());
    camera.position.set(50, 50, 50)
    camera.lookAt(scene.position)


    controls = new THREE.OrbitControls(camera);

    controls.update();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 200, 100);
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = -100;
    light.shadow.camera.left = -120;
    light.shadow.camera.right = 120;
    scene.add(light);
    var axes = new THREE.AxesHelper(1000)
    scene.add(axes)


    let userInput = new UserInput();
    let inputManager


    $("#root").append(GM.renderer.domElement);
    loadJSON('/JSON/textures.json').then(function (json) {

        GM.textureBank.loadTextures(json.textures)

        //bedzie trzeba jakis loader porzadny napisac by tekstury sie wgrały a dopiero potem to leciał bo pozniej sra bugami

        setTimeout(function () {
            ramp = new Ramp(new THREE.Vector3(0, 0, 0), new THREE.Vector3(30, 30, 30), new THREE.Euler(0, 3.14, 0, 'XYZ'), 'default')
            cube = new Cube(new THREE.Vector3(-45, 15, -15), new THREE.Vector3(30, 30, 30), new THREE.Euler(0, 3.14, 0, 'XYZ'), 'default')
            player = new Player(new THREE.Vector3(20, 0, 20), new THREE.Euler(0, 1, 0, 'XYZ'), 'models/runTest.fbx')
            floor = new Cube(new THREE.Vector3(0, -1, 0), new THREE.Vector3(400, 2, 400), new THREE.Euler(0, 3.14, 0, 'XYZ'), 'default')
            ramp.addParentContainer(scene)
            player.model.addParentContainer(scene)
            cube.addParentContainer(scene)
            inputManager = new InputManager(player, userInput)
            userInput.initKeyboard()
            floor.addParentContainer(scene)
        }, 1000)


    })

    let clock = new THREE.Clock();

    function render() {

        let timeDelta = clock.getDelta();
        if (player) {

            inputManager.update()
            player.update(timeDelta)

        }
        GM.physics.world.step(timeDelta)


        GM.renderer.render(scene, camera);
        requestAnimationFrame(render);
    }


    render();
})