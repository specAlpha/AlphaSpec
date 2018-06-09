class Character {
    constructor(positionVector3, Euler) {
        this.model = new Model(positionVector3, Euler)
        this.position = positionVector3;

    }

    update(deltaTime) {

        this.model.update(deltaTime)
    }

    updatePacket() {
        let p = GM.netHandler.getCharacter()
        if (p) {
            this.model.container.rotation.y = p.rotation;

            this.model.container.position.set(p.position.x, p.position.y, p.position.z)
            if (this.model.currentAnimation != p.animation)
                this.model.setAnimation(p.animation)

        }
    }
}