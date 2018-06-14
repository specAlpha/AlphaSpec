$(function () {


    GM.initCore();
    GM.initTHREE();
    GM.mainMenu.createLoading();
    GM.net.init()
    GM.assetsLoader.loadAsstes().then(function () {
        $("#root").append(GM.renderer.domElement);
        GM.mainMenu.removeLoading();
        GM.mainMenu.createMenu();
        GM.mainMenu.setupScene()

        GM.startGame('testlevel1.json')
    })


})