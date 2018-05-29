class InputManager {
    constructor(player, userInput) {
        this.player = player
        this.userInput = userInput;

    }


    update() {

        if (this.userInput.pressed.includes(87)) {
            this.player.moveVec.x += 10;
        }
        if (this.userInput.pressed.includes(83)) {
            this.player.moveVec.x -= 10;
        }
        if (this.userInput.pressed.includes(68)) {
            this.player.moveVec.z += 10;
        }
        if (this.userInput.pressed.includes(65)) {
            this.player.moveVec.z -= 10;
        }
        if (this.userInput.clicked.includes(32)) {
            this.player.jump();
        }

        this.userInput.removeClicked();
    }
}