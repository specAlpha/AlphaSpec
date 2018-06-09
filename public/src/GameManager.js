const GM = {
    characters: {
        player1: null,
        player2: null
    },
    playerID: 0
}


GM.assignPlayers = function (player1, player2) {
    this.characters.player1 = player1
    this.characters.player2 = player2
}
GM.initCore = function () {
    this.textureBank = new TextureBank();
    this.physics = new Physics();

    this.specialTilesHandler = new SpecialTilesHandler();

    this.net = new Net();
    this.net.init()
    this.netHandler = new NetHandler();
    this.clock = new Clock();
    this.UI = new UI();
    this.lvl = new Level();
    this.eventHandler = new EventHandler();
    this.modelBank = new ModelBank();


}
GM.initTHREE = function () {
    this.camera = new THREE.PerspectiveCamera(
        66,
        $(window).width() / $(window).height(),
        1,
        100
    );
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize($(window).width(), $(window).height());
    this.scene.background = new THREE.Color(0xa0a0a0);
    this.scene.fog = new THREE.Fog(this.scene.background, 0.0025, 1000);
    $("#root").append(GM.renderer.domElement);
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

