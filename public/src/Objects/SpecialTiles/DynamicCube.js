class DynamicCube extends Cube {
    constructor(positionVector3, sizeVector3, Euler, id, axis, moveTo, eventsArr) {
        super(positionVector3, sizeVector3, Euler, 'blue')
        this.id = id;
        this.axis = axis;
        this.moveTo = moveTo
        this.startPos = this.container.position[this.axis];

        this.needsToGoBack = false;
        this.animation = new AnimationHelper(this.moveTo - this.container.position[this.axis], 3);
        this.events = eventsArr;

    }

    update(deltaTime) {
        if (this.checkEvents()) {
            if (!this.animation.running) {
                this.animation.running = true;
                this.needsToGoBack = true;
            }
            this.container.position[this.axis] = this.startPos + this.animation.update(deltaTime);

            this.rigidBody.setPosition(THREEtoOimoVec(this.container.position))


        } else {
            if (this.needsToGoBack) {
                this.animation.inverse();
                this.needsToGoBack = false;
            }
            if (this.animation.running) {
                this.container.position[this.axis] = this.moveTo - this.animation.update(deltaTime);
                this.rigidBody.setPosition(THREEtoOimoVec(this.container.position))
                if (this.animation.complete)
                    this.animation.reset()
            }

        }

    }

    checkEvents() {
        let check
        for (let eventArr of this.events) {
            check = true;
            for (let event of eventArr) {
                check = event.fullfilled;
                if (!check)
                    break;
            }
            if (check)
                break
        }
        return check
    }

    addEvent(event, type) {

        if (this.events.length < type) {
            this.events.push([event])
        }
        else {
            this.events[type - 1].push(event)
        }

    }
}