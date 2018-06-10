class UI {
    constructor() {
        this.canvas3d = document.createElement('canvas')
        this.canvas3d.width = 1536;
        this.canvas3d.height = 1024;
        this.timerDiv = $('#timer');

        this.texture = new THREE.CanvasTexture(this.canvas3d)
        this.plane = new Plane(new THREE.Vector3(-25, 20, 20), new THREE.Vector3(30, 20, 0), new THREE.Euler(0, Math.PI + -Math.PI / 8, 0), '', false,
            new THREE.MeshBasicMaterial({
                map: this.texture,
                side: THREE.FrontSide,
                opacity: 1,
                transparent: true
            })
        )
        this.timerHelper = new TimerHelper(15, 15)

    }

    setPlaneImg(image) {
        this.timerHelper.running = true;
        this.canvas3d.getContext('2d').drawImage(GM.textureBank.getImage(image), 0, 0, this.canvas3d.width, this.canvas3d.height)
        this.texture.needsUpdate = true;

    }

    update(time) {
        if (this.timerHelper.running) {

            this.plane.material.opacity = 15 - this.timerHelper.update(time)
            if (this.timerHelper.complete) {
                this.timerHelper.reset();

            }
        }


        let data = new Date((1 - GM.timer.update(time)) * GM.timer.time * 1000)
        let min = data.getMinutes() > 9 ? data.getMinutes() : "0" + data.getMinutes()
        let sec = data.getSeconds() > 9 ? data.getSeconds() : "0" + data.getSeconds()
        this.timerDiv.html(min + ':' + sec)


    }

    createCrossHair() {
        let img = $(GM.textureBank.getImage('crossHair')).clone()
        img.attr('id', 'crosshair').appendTo('body');

    }


}