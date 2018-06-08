class Net {
    constructor() {
        //this.client = io();

    }

    init() {
        this.client.on('onconnect', (data) => {

        })
        this.client.on('packet', (data) => {

        })
    }

    emmitPacket(obj) {
        this.client.emit('packet', obj)
    }
}