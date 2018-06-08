class UI {
    constructor() {
        this.canvas3d = document.createElement('canvas')
        this.canvas3d.width = 100;
        this.canvas3d.height = 50;


        this.texture = new THREE.CanvasTexture(this.canvas3d)
        this.plane = new Plane(new THREE.Vector3(-25, 20, 20), new THREE.Vector3(30, 20, 0), new THREE.Euler(0, -Math.PI / 8, 0), '', false,
            new THREE.MeshBasicMaterial({
                map: this.texture,
                side: THREE.DoubleSide,
                opacity: 1,
                transparent: true
            })
        )
        this.timerHelper = new TimerHelper(5, 1)

    }

    setPlaneImg(image) {
        this.timerHelper.running = true;
        this.canvas3d.getContext('2d').drawImage(GM.textureBank.getImage(image), 0, 0, 100, 50)
        this.texture.needsUpdate = true;

    }

    update(time) {
        if (this.timerHelper.running) {
            this.timerHelper.update(time)
            if (this.timerHelper.complete) {
                this.timerHelper.reset();
                this.canvas3d.getContext('2d').clearRect(0, 0, 100, 50)
                this.texture.needsUpdate = true;
            }
        }


    }


}