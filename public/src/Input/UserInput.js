class UserInput {
    constructor() {
        this.pressed = []; //poki wcisniety
        this.clicked = []; //jedna klatka po kliknieciu
        this.mousePos = {
            x: 0,
            y: 0,
        }

    }

    initKeyboard() {
        let that = this;
        $(document).on('keydown', function (e) {
            if (!that.pressed.includes(e.which)) {
                that.pressed.push(e.which)
                that.clicked.push(e.which)
            }
        })
        $(document).on('keyup', function (e) {
            that.pressed.splice(that.pressed.indexOf(e.which), 1)


        })


    }

    setPointerLock(canvas) {
        canvas.requestPointerLock = canvas.requestPointerLock ||
            canvas.mozRequestPointerLock;

        document.exitPointerLock = document.exitPointerLock ||
            document.mozExitPointerLock;
    }

    disablePointerLock() {

    }

    removeClicked() {
        this.clicked = [];
    }

}