class Event {
    constructor() {
        this.fullfilled = false;
        this.wires = [];
        this.emmiter = null;
        this.receiver = null;
    }

    setEmmiter(emmiter) {
        this.emmiter = emmiter;
    }

    setReceiver(receiver) {
        this.receiver = receiver;
    }
}