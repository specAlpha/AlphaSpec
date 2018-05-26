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


}