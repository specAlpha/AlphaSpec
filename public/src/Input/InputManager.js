class InputManager {
    constructor() {
        this.player = null;

        this.keybinds = [];
        this.pressedKeyBinds = {};
        this.clickedKeyBinds = {};

        this.mouseMove = true;
    }

    loadKeybindings(json) {
        this.keybinds = json.keybinds;
        this.initKeybinds()
    }

    setPlayer(player) {
        this.player = player;
    }


    initKeybinds() {
        for (let bind of this.keybinds) {
            if (bind.pressed)
                this.pressedKeyBinds[bind.keycode] = {target: bind.target, action: bind.action};
            else
                this.clickedKeyBinds[bind.keycode] = {target: bind.target, action: bind.action};
        }


    }


    update() {
        if (!this.player)
            return

        for (let key of GM.userInput.pressed) {
            let bind = this.pressedKeyBinds[key] || false;
            if (bind) {
                this[bind.target][bind.action]();

            }
        }
        for (let key of GM.userInput.clicked) {
            let bind = this.clickedKeyBinds[key] || false;
            if (bind) {
                this[bind.target][bind.action]();

            }
        }

        if (this.mouseMove) {

            this.player.controlCamera(GM.userInput.mouse.movement)

        }


        GM.userInput.mouse.movement = {x: 0, y: 0}


        GM.userInput.removeClicked();
    }

    postUpdate() {
        if (GM.userInput.mouse.clicked) {
            this.player.shootRay()
        }

        this.player.moveCube(GM.userInput.mouse.pressed)
        GM.userInput.mouse.clicked = false;
    }
}