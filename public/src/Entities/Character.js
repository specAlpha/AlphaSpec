class Character {
    constructor(positionVector3, Euler, url) {
        this.model = new Model(positionVector3, Euler, url)
        this.position = positionVector3;

    }

    update(deltaTime) {

        this.model.update(deltaTime)
    }
}