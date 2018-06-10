class NetHandler {
    constructor() {
        this.lastReceivedPacket = {
            player: {},
            events: [],
            mobileCube: {}
        };
        this.packetToSend = {
            player: {},
            events: [],
            mobileCube: {}
        }

    }

    savePacket(packet) {
        this.lastReceivedPacket = packet;

    }

    infoFromPlayer(pos, rot, animation) {

        this.packetToSend.player.position = pos;
        this.packetToSend.player.rotation = rot;
        this.packetToSend.player.animation = animation;
    }

    addEventToSend(id) {
        this.packetToSend.events.push(id);
    }

    addMobileCube(id, pos) {
        this.packetToSend.mobileCube.position = pos;
        this.packetToSend.mobileCube.id = id;

    }

    sendPacket() {
        GM.net.emmitPacket(this.packetToSend)
        this.packetToSend = {
            player: {},
            events: [],
            mobileCube: {}
        };
    }

    getCharacter() {
        if (this.lastReceivedPacket.player.position)
            return this.lastReceivedPacket.player
        else
            return null;
    }

    getEvents() {
        if (this.lastReceivedPacket.events)
            return this.lastReceivedPacket.events
        else
            return null;
    }

    getMobileCube() {
        if (this.lastReceivedPacket.mobileCube.id)
            return this.lastReceivedPacket.mobileCube
        else
            return null;
    }
}