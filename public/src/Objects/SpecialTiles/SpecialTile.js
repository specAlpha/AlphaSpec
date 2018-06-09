class SpecialTile extends Component {
    constructor(positionVector3, Euler, id, eventsArr, isEmmiter, updatable) {
        super(positionVector3, Euler);
        this.id = id;
        this.events = eventsArr;
        this.emmiter = isEmmiter; //emmits events or receive events
        this.needsUpdate = updatable;
        this.geometries = [];
        this.materials = [];
        this.meshes = [];


    }

    addMeshesToConainer() {
        for (let mesh of this.meshes) {
            mesh.accessToClass = this;
            mesh.receiveShadow = true
            mesh.castShadow = true
            this.container.add(mesh)
        }
    }

    update() {
        if (!this.needsUpdate)
            return
    }

    resetEvents() {
        for (let eventArr of this.events)

            for (let event of eventArr)
                event.reject()

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

    fullFill() {

        if (this.emmiter)
            for (let event of this.events) {
                event.fullfill();
            }

    }

    cancel() {
        if (this.emmiter)
            for (let event of this.events) {
                event.reject()
            }
    }

    addEvent(event, type) {
        if (this.emmiter) {
            this.events.push(event)
        }
        else {
            if (this.events.length < type) {
                this.events.push([event])
            }
            else {
                this.events[type - 1].push(event)
            }
        }
    }
}