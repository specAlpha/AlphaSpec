class Net {
    constructor() {
        this.client = io();

    }

    init() {
        this.client.on('onconnect', (data) => {
            GM.playerID = data.id;
            console.log(data.id)
        })
        this.client.on('packet', (packet) => {
            GM.netHandler.savePacket(packet);
        })
    }

    emmitPacket(obj) {
        this.client.emit('packet', obj)
    }
}