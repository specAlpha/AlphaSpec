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

}