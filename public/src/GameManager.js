GM = {
    textureBank: new TextureBank(),
    renderer: new THREE.WebGLRenderer(),
    physics: new Physics(),
    camera: new THREE.PerspectiveCamera(
        66,
        $(window).width() / $(window).height(),
        1,
        1000
    ),
    scene: new THREE.Scene(),
    specialTilesHandler: new SpecialTilesHandler(),
    characters: {
        player1: null,
        player2: null
    },
    net: new Net(),
    netHandler: new NetHandler(),
    clock: new Clock(),
    UI: new UI(),

}


GM.assignPlayers = function (player1, player2) {
    this.characters.player1 = player1
    this.characters.player2 = player2
}

function OIMOtoThreeVec3(OimoVec) {
    return new THREE.Vector3(OimoVec.x, OimoVec.y, OimoVec.z)

}

function THREEtoOimoVec(vec) {
    return new OIMO.Vec3(vec.x, vec.y, vec.z)

}

function OIMOtoThreeQuat(quat) {
    return new THREE.Quaternion(quat.x, quat.y, quat.z, quat.w)

}

function loadImage(url) {

}