class UserInput {
    constructor() {
        this.pressed = []; //poki wcisniety
        this.clicked = []; //jedna klatka po kliknieciu
        this.mouse = {
            maxX: $(window).width(),
            maxY: $(window).height(),
            position: {
                x: $(window).width() / 2,
                y: $(window).height() / 2,
            },
            movement: {
                x: 0,
                y: 0
            }


        }
        this.enablePointerLock = false;

    }

    initMouse() {
        let that = this;
        document.addEventListener('mousemove', function (e) {


            let movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0,
                movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;


            that.mouse.movement.x = movementX;
            that.mouse.movement.y = movementY;
            if (that.mouse.position.x + movementX > 0 && that.mouse.position.x + movementX < that.mouse.maxX - that.mouse.mouseWidth)
                that.mouse.position.x += movementX
            else if (that.mouse.position.x + movementX <= 0)
                that.mouse.position.x = 0;
            else
                that.mouse.position.x = that.mouse.maxX - that.mouse.mouseWidth;

            if (that.mouse.position.y + movementY > 0 && that.mouse.position.y + movementY < that.mouse.maxY - that.mouse.mouseHeight)
                that.mouse.position.y += movementY
            else if (that.mouse.position.y + movementY <= 0)
                that.mouse.position.y = 0;
            else
                that.mouse.position.y = that.mouse.maxY - that.mouse.mouseHeight;


        })
        document.addEventListener('mousedown', function (e) {
            if (!that.mouse.pressed) {
                that.mouse.clicked = true;
                that.mouse.pressed = true;
            }
        })

        document.addEventListener('mouseup', function (e) {

            that.mouse.clicked = false;
            that.mouse.pressed = false;

        })


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

        this.enablePointerLock = true;

        canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;


        document.addEventListener('pointerlockchange', lockChangeAlert);
        document.addEventListener('mozpointerlockchange', lockChangeAlert);
        let that = this;

        function lockChangeAlert() {
            if (document.pointerLockElement === canvas ||
                document.mozPointerLockElement === canvas) {
                GM.pointerLock = true;
                document.removeEventListener('click', addPointerLock)

            } else {
                GM.pointerLock = false;
                if (that.enablePointerLock)
                    document.addEventListener('click', addPointerLock)

            }

        }

        document.addEventListener('click', addPointerLock)

        function addPointerLock() {
            canvas.requestPointerLock();
        }
    }

    disablePointerLock() {

        this.enablePointerLock = false;

    }

    removeClicked() {
        this.clicked = [];
    }

}