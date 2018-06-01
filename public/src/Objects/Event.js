class Event {
    constructor() {
        this.fullfilled = false;
        this.wires = [];
        this.emmiter = null;
        this.receiver = null;
        this.needsToBeSend = false; // send only if emmits from raycaster
    }

    setEmmiter(emmiter) {
        this.emmiter = emmiter;
    }

    setReceiver(receiver) {
        this.receiver = receiver;
    }
}