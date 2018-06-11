$(function () {


    GM.initCore();
    GM.initTHREE();
    GM.mainMenu.createLoading();
    GM.net.init()
    GM.assetsLoader.loadAsstes().then(function () {
        GM.mainMenu.removeLoading();
        GM.mainMenu.createMenu();
        GM.mainMenu.setupScene()

    })


})