class Net {
    constructor() {
        this.client = io();
        this.roomID = '';

    }

    setRoomID(id) {
        this.roomID = id;
    }

    init() {
        this.client.on('createRoom', (data) => {
            GM.playerID = data.id;
            this.setRoomID(data.roomID)
            GM.mainMenu.mainMenuWrapper.empty();
            GM.mainMenu.createAlert('Oczekiwanie na drugiego gracza')
        })
        this.client.on('packet', (packet) => {
            GM.netHandler.savePacket(packet);
        })
        this.client.on('gameStart', (data) => {
            GM.startGame(data.map);
        })
        this.client.on('error', (data) => {
            GM.mainMenu.createAlert('Something went wrong....')
            GM.mainMenu.goToMenuWithDelay(3000);
        })
        this.client.on('disconnected', (data) => {
            GM.stopLoop = true;
            GM.mainMenu.createAlert('Player left :(')
            GM.mainMenu.goToMenuWithDelay(3000);
        })
        this.client.on('showMaps', (data) => {

            GM.mainMenu.mapCreator(data.maps)
        })
        this.client.on('showRooms', (data) => {
            GM.mainMenu.roomJoiner(data.rooms)

        })
        this.client.on('joinRoom', (data) => {
            GM.playerID = data.id;
        })

    }

    emmitPacket(obj) {
        this.client.emit('packet', {packet: obj, roomID: this.roomID})
    }

    emmitCreateRoom(name, roomName, map) {
        this.client.emit('createRoom', {name: name, roomName: roomName, map: map})
    }

    emmitjoinRoom(name, roomID) {
        this.roomID = roomID;
        this.client.emit('joinRoom', {name: name, roomID: roomID})
    }

    emmitShowRooms() {
        this.client.emit('showRooms', {})
    }

    emmitshowMaps() {
        this.client.emit('showMaps', {})
    }

    emmitWin(time) {
        this.client.emit('win', {timeLeft: time, roomID: this.roomID})

    }

    emmitLose() {
        this.client.emit('lose', {roomID: this.roomID})

    }
}