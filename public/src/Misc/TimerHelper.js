class TimerHelper {
    constructor(time, number) {
        this.time = time;
        this.number = number;
        this.perSecond = number / time
        this.actualNumber = 0;
        this.running = false;
        this.complete = false;
    }

    update(time) {
        if (this.running) {
            this.actualNumber += time * this.perSecond;
            if (this.actualNumber > this.number) {
                this.actualNumber = this.number;
                this.complete = true;
            }

        }
        return this.actualNumber;

    }

    reset() {
        this.actualNumber = 0;
        this.complete = false;
        this.running = false;
    }


}