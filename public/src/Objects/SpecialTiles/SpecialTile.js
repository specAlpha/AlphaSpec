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
        for (let event of this.events) {
            event.fullfilled = false;
        }
    }

    checkEvents() {
        let check = true;
        for (let event of this.events) {
            check = event.fullfilled;
        }
        return check
    }

    fullFill() {

        if (this.emmiter)
            for (let event of this.events) {
                event.fullfilled = true;
            }

    }

    cancel() {
        if (this.emmiter)
            for (let event of this.events) {
                event.fullfilled = false;
            }
    }

}