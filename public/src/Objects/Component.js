class Component {
    constructor(positionVector3, Euler) {
        this.position = positionVector3;
        this.rotation = Euler;
        this.container = new THREE.Object3D();
        this.container.position.add(this.position);
        this.container.setRotationFromEuler(Euler);
    }

    addParentContainer(container) {
        container.add(this.container)
    }

    removeParentContainer(container) {
        container.remove(this.container)
    }

    addChlidContainer(child) {
        this.container.add(child)
    }

    getWorldDirection() {
        let vector = new THREE.Vector3();
        this.container.getWorldDirection(vector);
        return vector;
    }

    setMatrixAutoUpdate(value) {
        this.container.matrixAutoUpdate = value;
    }

    setNewPosition(vector) {
        this.container.position.copy(vector);
    }


}