// TODO make it work


$(function () {


    GM.initCore();
    GM.initTHREE();
    GM.UI.createLoading();
    GM.net.init()
    GM.assetsLoader.loadAsstes().then(function () {
        GM.UI.removeLoading();
        let name = prompt('Podaj nick');
        let roomID = prompt('Podaj nazwę pokoju')
        GM.net.setRoomID(roomID)
        GM.net.emmitHello(name, roomID)
    })


})