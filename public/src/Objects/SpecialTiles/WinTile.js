class WinTile extends SpecialTile {
    constructor() {
        super(new THREE.Vector3(), new THREE.Euler(0, 0, 0), 'win', [], false, true);
        this.timer = new TimerHelper(1, 1)
    }

    update(time) {
        if (this.checkEvents()) {
            this.timer.update(time)
            this.timer.running = true;

            if (this.timer.complete)
                GM.win();
        } else {
            console.log('aaa')
            this.timer.reset();

        }
    }
}