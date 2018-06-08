class Clock {
    constructor() {
        this.timer = Date.now();
        this.threeTimer = new THREE.Clock();

    }

    getTimer() {
        let deltaTime = (Date.now() - this.timer) / 1000;
        this.timer = Date.now();
        return deltaTime;

    }

    getThreeTimer() {
        return this.threeTimer.getDelta();
    }

}