class AnimationHelper {
    constructor(value, time) {
        this.time = time;
        this.running = false;
        this.value = value;
        this.actualNumber = 0;
        this.actualTime = 0;
        this.complete = false;


    }

    easeInOutQuad(t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    }

    update(deltaTime) {
        if (this.running) {
            this.actualTime += deltaTime;
            let a = 0;
            if (this.actualTime / this.time > 1)
                a = 1
            else
                a = this.actualTime / this.time

            this.actualNumber += this.easeInOutQuad(a) * this.value;
            if (this.actualNumber > this.value) {
                this.actualNumber = this.value;
                this.complete = true;

            }

            return this.actualNumber;
        }

    }

    reset() {
        this.actualNumber = 0;
        this.actualTime = 0;
        this.complete = false;
        this.running = false;
    }

    inverse() {
        if (this.complete)
            this.actualTime = 0

        this.complete = false;
        this.actualNumber = this.value - this.actualNumber;

    }


}