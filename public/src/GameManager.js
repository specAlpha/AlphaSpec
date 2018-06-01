GM = {
    textureBank: new TextureBank(),
    renderer: new THREE.WebGLRenderer(),
    physics: new Physics(),
    camera: new THREE.PerspectiveCamera(
        66,
        $(window).width() / $(window).height(),
        0.1,
        10000
    ),
    scene: new THREE.Scene(),
    specialTilesHandler: new SpecialTilesHandler(),
    characters: {
        player1: null,
        player2: null
    }

}


GM.assignPlayers = function (player1, player2) {
    this.characters.player1 = player1
    this.characters.player2 = player2
}