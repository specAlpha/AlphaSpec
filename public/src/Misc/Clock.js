class Clock {
    constructor() {
        this.timer = null
        this.threeTimer = null;
    }

    getTimer() {
        let deltaTime = (Date.now() - this.timer) / 1000;
        this.timer = Date.now();
        return deltaTime;

    }

    getThreeTimer() {
        return this.threeTimer.getDelta();
    }

    enableClock() {
        this.timer = Date.now();
        this.threeTimer = new THREE.Clock();
    }

}