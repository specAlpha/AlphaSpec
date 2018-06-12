const GM = {
    characters: {
        player1: null,
        player2: null
    },
    playerID: 0
}


GM.assignPlayers = function (player1, player2) {
    this.characters.player1 = player1
    this.characters.player2 = player2
}
GM.initCore = function () {
    this.textureBank = new TextureBank();
    this.physics = new Physics();

    this.specialTilesHandler = new SpecialTilesHandler();
    this.mainMenu = new MainMenu();
    this.net = new Net();
    this.userInput = new UserInput();
    this.inputManager = new InputManager();
    this.assetsLoader = new AssetsLoader();
    this.netHandler = new NetHandler();
    this.clock = new Clock();
    this.UI = new UI();
    this.lvl = new Level();
    this.eventHandler = new EventHandler();
    this.modelBank = new ModelBank();
    this.stopLoop = false;
    this.timer = new TimerHelper(600, 1)


}
GM.initTHREE = function () {
    this.camera = new THREE.PerspectiveCamera(
        66,
        $(window).width() / $(window).height(),
        1,
        1000
    );


    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize($(window).width(), $(window).height());


}
GM.startGame = function (name) {
    GM.scene = new THREE.Scene();
    GM.scene.background = new THREE.Color(0xa0a0a0);
    GM.scene.fog = new THREE.Fog(this.scene.background, 0.0025, 1000);
    GM.mainMenu.run = false;
    GM.mainMenu.mainMenuWrapper.empty();
    GM.physics = new Physics();
    GM.assetsLoader.loadLevel(name).then(function () {

        GM.userInput.setPointerLock(GM.renderer.domElement)
        GM.userInput.initKeyboard()
        GM.userInput.initMouse()
        GM.timer.running = true;
        GM.UI.createCrossHair();
        GM.lvl.spawnPlayers();
        GM.clock.enableClock()
        GM.mainLoop()
    })

}
GM.win = function () {


    this.stopLoop = true;
    if (GM.playerID == 0)
        GM.net.emmitWin((1 - GM.timer.actualNumber) * GM.timer.time * 1000);
    GM.mainMenu.createAlert('Win')
    GM.mainMenu.goToMenuWithDelay(3000);
}
GM.lose = function () {


    this.stopLoop = true;
    if (GM.playerID == 0)
        GM.net.emmitLose((1 - GM.timer.actualNumber) * GM.timer.time * 1000);
    GM.mainMenu.createAlert('Czas sie skończył')
    GM.mainMenu.goToMenuWithDelay(3000);
}
GM.mainLoop = function () {
    if (GM.timer.complete) {
        GM.lose();
        return
    }

    let threeTimer = GM.clock.getThreeTimer()
    let timer = GM.clock.getTimer()

    GM.physics.world.step(0.016)

    if (GM.characters.player1) {
        GM.inputManager.update()
        GM.characters.player1.update(threeTimer)
        GM.inputManager.postUpdate();
        GM.eventHandler.update(timer);
        GM.specialTilesHandler.update(timer);
        GM.UI.update(timer)
        GM.netHandler.sendPacket();
    }


    if (GM.characters.player2) {
        GM.characters.player2.updatePacket()
        GM.characters.player2.update(threeTimer)

    }
    // console.log(GM.characters.player1.model.container.position)
    GM.renderer.render(GM.scene, GM.camera);
    if (!GM.stopLoop)
        requestAnimationFrame(GM.mainLoop);
}
