class Net {
    constructor() {
        this.client = io();
        this.roomID = ''

    }

    setRoomID(id) {
        this.roomID = id;
    }

    init() {
        this.client.on('onconnect', (data) => {
            GM.playerID = data.id;
        })
        this.client.on('packet', (packet) => {
            GM.netHandler.savePacket(packet);
        })
        this.client.on('gameStart', (data) => {
            GM.startGame();
        })
        this.client.on('error', (data) => {
            alert('ERROR')
        })

    }

    emmitPacket(obj) {
        this.client.emit('packet', {packet: obj, roomID: this.roomID})
    }

    emmitHello(name, roomID) {
        this.client.emit('Hello', {name: name, roomID: roomID})
    }

    emmitWin(time) {
        this.client.emit('win', {timeLeft: time, roomID: this.roomID})

    }

    emmitLose() {
        this.client.emit('lose', {roomID: this.roomID})

    }
}