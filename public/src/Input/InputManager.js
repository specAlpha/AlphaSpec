class InputManager {
    constructor(keybinds, player, userInput) {
        this.player = player
        this.userInput = userInput;
        this.keybinds = keybinds.keybinds;
        this.pressedKeyBinds = {};
        this.clickedKeyBinds = {};
        this.initKeybinds()
        this.mouseMove = true;
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

        for (let key of this.userInput.pressed) {
            let bind = this.pressedKeyBinds[key] || false;
            if (bind) {
                this[bind.target][bind.action]();

            }
        }
        for (let key of this.userInput.clicked) {
            let bind = this.clickedKeyBinds[key] || false;
            if (bind) {
                this[bind.target][bind.action]();

            }
        }

        if (this.mouseMove) {

            this.player.controlCamera(this.userInput.mouse.movement)

        }
        this.userInput.mouse.movement = {x: 0, y: 0}


        this.userInput.removeClicked();
    }
}