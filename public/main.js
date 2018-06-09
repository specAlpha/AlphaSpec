// TODO make it work


$(function () {

    function loadJSON(url) {
        return fetch(url).then(resolve => resolve.json())

    }

    GM.initCore();
    GM.initTHREE();


    let scene;

    scene = GM.scene;
    let player


    let userInput = new UserInput();
    let inputManager


    $("#root").append(GM.renderer.domElement);
    loadJSON('/JSON/Models.json').then(function (json) {
        GM.modelBank.loadFromJSON(json);
        setTimeout(function () {
            GM.modelBank.combaine();
            GM.characters.player1.model.loadModel(GM.playerID)
            if (GM.playerID == 0)
                GM.characters.player2.model.loadModel(1)
            else
                GM.characters.player2.model.loadModel(0)
            render();
        }, 2000)

    })
    loadJSON('/JSON/textures.json').then(function (json) {

        GM.textureBank.load(json).then(function () {



            //bedzie trzeba jakis loader porzadny napisac by tekstury sie wgrały a dopiero potem to leciał bo pozniej sra bugami


            loadJSON('/JSON/Level.json').then(function (json) {
                GM.lvl.createLevel(json)
            })


            userInput.initKeyboard()
            userInput.initMouse()


            loadJSON('/JSON/Keybinds.json').then(function (json) {
                inputManager = new InputManager(json, GM.characters.player1, userInput)
                userInput.setPointerLock(GM.renderer.domElement)

            })

        })


    })


    function render() {
        let threeTimer = GM.clock.getThreeTimer()
        let timer = GM.clock.getTimer()

        GM.physics.world.step(0.016)

        if (GM.characters.player1) {
            inputManager.update()
            GM.characters.player1.update(threeTimer)
            inputManager.postUpdate();
            GM.eventHandler.update(timer);
            GM.specialTilesHandler.update(timer);
            GM.UI.update(timer)
            GM.netHandler.sendPacket();
        }
        if (GM.characters.player2) {
            GM.characters.player2.updatePacket()
            GM.characters.player2.update(threeTimer)

        }


        GM.renderer.render(GM.scene, GM.camera);
        requestAnimationFrame(render);
    }


})