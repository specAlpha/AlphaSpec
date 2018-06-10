class WinTile extends SpecialTile {
    constructor() {
        super(new THREE.Vector3(), new THREE.Euler(0, 0, 0), 'win', [], false, true);

    }

    update() {
        if (this.checkEvents()) {

            GM.win();
        }
    }
}