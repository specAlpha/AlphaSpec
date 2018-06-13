class Event {
    constructor(type) {
        this.fullfilled = false;
        this.type = type
        this.wires = [];
        this.emmiter = null;
        this.receiver = null;
        this.timerHelper = new TimerHelper(1, 1);

    }

    setEmmiter(emmiter) {
        this.emmiter = emmiter;
        emmiter.addEvent(this, this.type)
    }

    setReceiver(receiver) {
        this.receiver = receiver;
        receiver.addEvent(this, this.type)
    }

    createWire(wire) {
        let posV = new THREE.Vector3(wire.position.x, wire.position.y, wire.position.z)
        let sizeV = new THREE.Vector3(wire.size.x, wire.size.y, wire.size.z)
        let euler = new THREE.Euler(wire.rotation.x, wire.rotation.y, wire.rotation.z)
        let obj = new Plane(posV, sizeV, euler, 'wireDisabled', true)

        obj.addParentContainer(GM.scene)
        this.wires.push(obj)

    }

    fullfill() {
        this.fullfilled = true;
        this.timerHelper.reset();


        for (let wire of this.wires) {
            wire.material.map = GM.textureBank.getTexture('wireEnabled', wire.size.x / 10, wire.size.y / 10)
        }
    }

    reject() {
        this.timerHelper.running = true;
        this.fullfilled = false;

    }

    update(time) {

        if (this.timerHelper.update(time) == 1) {

            this.timerHelper.reset();
            for (let wire of this.wires) {
                wire.material.map = GM.textureBank.getTexture('wireDisabled', wire.size.x / 10, wire.size.y / 10)
            }
        }


    }
}