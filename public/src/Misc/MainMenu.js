class MainMenu {
    constructor() {
        this.scene = new THREE.Scene();
        this.run = false;
        this.createRoomButton = null
        this.joinRoomButton = null
        this.loadingBarIn = null;
        this.loadingBarOut = null;

        this.angle = 0;
        this.clock = new THREE.Clock();

        this.mainMenuWrapper = $('<div>').attr('id', 'mainWrapper').appendTo('body');
    }

    createMenu() {
        this.mainMenuWrapper.empty();
        let title = $('<div>').attr('id', 'title').html('Nazwa Gierki').addClass('centerX').appendTo(this.mainMenuWrapper);
        let createRoomButton = $('<div>').attr('id', 'createRoom').html('Create Room').addClass('centerX').appendTo(this.mainMenuWrapper);
        let joinRoomButton = $('<div>').attr('id', 'joinRoom').html('Join Room').addClass('centerX').appendTo(this.mainMenuWrapper);
        createRoomButton.on('click', function () {
            GM.net.emmitshowMaps();

        })
        joinRoomButton.on('click', function () {
            GM.net.emmitShowRooms();
        })

    }

    mapCreator(maps) {
        this.mainMenuWrapper.empty();

        let roomName = $('<input>').addClass('input').attr('id', 'roomName').addClass('centerX').appendTo(this.mainMenuWrapper)
        let roomNameLabel = $('<div>').html('Room Name').attr('id', 'roomNameLabel').addClass('centerX').appendTo(this.mainMenuWrapper)
        let playerNameLabel = $('<div>').html('Player Name').attr('id', 'playerNameLabel').addClass('centerX').appendTo(this.mainMenuWrapper)
        let playerName = $('<input>').addClass('input').attr('id', 'playerName').addClass('centerX').appendTo(this.mainMenuWrapper)
        let sumbit = $('<div>').attr('id', 'submit').html('Create').appendTo(this.mainMenuWrapper);
        let back = $('<div>').attr('id', 'back').html('Back').appendTo(this.mainMenuWrapper);
        back.on('click', function () {
            GM.mainMenu.createMenu()
        })
        sumbit.on('click', function () {
            if (roomName.val() && playerName.val()) {

                GM.net.emmitCreateRoom(playerName.val(), roomName.val(), select.val())


            } else {
                alert('Wprowadz dane')
            }

        })

        let select = $('<select/>').attr('id', 'select').addClass('centerX').appendTo(this.mainMenuWrapper);
        console.log(maps)
        for (let map of maps) {
            select.append($('<option/>').html(map).attr('value', map));
        }
    }

    roomJoiner(rooms) {
        this.mainMenuWrapper.empty();
        let playerNameLabel = $('<div>').html('Player Name').attr('id', 'playerNameLabel').addClass('centerX').appendTo(this.mainMenuWrapper)
        let playerName = $('<input>').addClass('input').attr('id', 'playerName').addClass('centerX').appendTo(this.mainMenuWrapper)
        let sumbit = $('<div>').attr('id', 'submit').html('Join').appendTo(this.mainMenuWrapper);
        let back = $('<div>').attr('id', 'back').html('Back').appendTo(this.mainMenuWrapper);
        back.on('click', function () {
            GM.mainMenu.createMenu()
        })
        sumbit.on('click', function () {
            if (playerName.val()) {

                GM.net.emmitjoinRoom(playerName.val(), select.val())
                GM.mainMenu.mainMenuWrapper.empty();


            } else {
                alert('Wprowadz dane')
            }

        })

        let select = $('<select/>').attr('id', 'select').addClass('centerX').appendTo(this.mainMenuWrapper);

        for (let room of rooms) {
            select.append($('<option/>').html(room.roomName).attr('value', room.roomID));
        }
    }


    loop() {
        let time = GM.mainMenu.clock.getDelta()
        GM.mainMenu.model.update(time)
        GM.mainMenu.model2.update(time)
        GM.mainMenu.angle += 0.005
        GM.camera.position.z = 50 * Math.cos(GM.mainMenu.angle);
        GM.camera.position.x = 50 * Math.sin(GM.mainMenu.angle);
        GM.camera.lookAt(new THREE.Vector3(0, 10, 0))
        GM.renderer.render(GM.mainMenu.scene, GM.camera);
        if (GM.mainMenu.run)
            requestAnimationFrame(GM.mainMenu.loop);
    }

    createLoading() {

        this.loadingBarOut = $('<div>').attr('id', 'loadBarOut').appendTo('body');
        this.loadingBarIn = $('<div>').attr('id', 'loadBarIn').appendTo(this.loadingBarOut);
    }

    addProgress() {


        this.loadingBarIn.css('width', parseInt(this.loadingBarIn.css('width')) + 100 + 'px');
    }

    removeLoading() {
        this.loadingBarOut.remove()
        this.loadingBarIn.remove()
    }

    setupScene() {


        this.run = true;
        let obj = new Cube(new THREE.Vector3(0, 0, 0), new THREE.Vector3(500, 2, 500), new THREE.Euler(0, 0, 0), 'default')
        let obj2 = new Cube(new THREE.Vector3(0, 20, 0), new THREE.Vector3(40, 40, 40), new THREE.Euler(0, 0, 0), 'default')
        let ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
        this.scene.background = new THREE.Color(0xa0a0a0);
        this.scene.fog = new THREE.Fog(this.scene.background, 0.0025, 500);
        GM.camera.position.y = 10;
        this.model = new Model(new THREE.Vector3(30, 0.1, 0), new THREE.Euler(0, 1.57, 0))
        this.model2 = new Model(new THREE.Vector3(-30, 0.1, 0), new THREE.Euler(0, -1.57, 0))
        this.model.loadModel(0);
        this.model2.loadModel(1);


        let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

        directionalLight.position.set(200, 200, 200)
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;  // default
        directionalLight.shadow.mapSize.height = 2048; // default

        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;

        directionalLight.shadow.camera.bottom = -100;
        directionalLight.shadow.camera.top = 100;
        this.scene.add(directionalLight)
        this.scene.add(ambientLight)
        obj.addParentContainer(this.scene)
        obj2.addParentContainer(this.scene)
        this.model.addParentContainer(this.scene)
        this.model2.addParentContainer(this.scene)
        this.loop()
    }

    createAlert(text) {
        let alert = $('<div>').addClass('alert').html(text).appendTo(this.mainMenuWrapper);


    }

    goToMenuWithDelay(delay) {
        GM.UI.removeCrossHair();
        GM.userInput.disablePointerLock();
        setTimeout(function () {
            GM.camera.position.y = 10;
            GM.mainMenu.createMenu();
            GM.mainMenu.run = true
            GM.mainMenu.loop();
        }, delay)
    }
}