class SpecialTile extends Component {
    constructor(positionVector3, Euler, id, eventsArr, isEmmiter) {
        super(positionVector3, Euler);
        this.id = id;
        this.events = eventsArr;
        this.emmiter = isEmmiter; //emmits events or receive events
        this.geometries = [];
        this.materials = [];
        this.meshes = [];


    }

    addMeshesToConainer() {
        for (let mesh of this.meshes) {
            if (this.emmiter)
                mesh.accessToClass = this;
            mesh.receiveShadow = true
            mesh.castShadow = true
            this.container.add(mesh)
        }
    }

    update() {
        if (this.emmiter)
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

}