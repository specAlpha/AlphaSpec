class WinTile extends SpecialTile {
    constructor() {
        super(new THREE.Vector3(), new THREE.Euler(0, 0, 0), 'win', [], false, true);
        this.timer = new TimerHelper(0.3, 1)
    }

    update() {
        if (this.checkEvents()) {
            this.timer.running = true;
            if (this.timer.complete)
                GM.win();
        } else {
            this.timer.reset();

        }
    }
}