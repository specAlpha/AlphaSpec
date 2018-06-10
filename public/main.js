// TODO make it work


$(function () {


    GM.initCore();
    GM.initTHREE();
    GM.net.init()
    GM.assetsLoader.loadAsstes().then(function () {
        let name = prompt('Podaj nick');
        let roomID = prompt('Podaj nazwę pokoju')
        GM.net.setRoomID(roomID)
        GM.net.emmitHello(name, roomID)
    })


})