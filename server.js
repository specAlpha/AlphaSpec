const http = require("http");

const path = require("path")


const express = require("express")
const PORT = 3000;
const Nedb = require('nedb')
const app = express();
app.use(express.static('public'))
const server = require('http').Server(app);
const io = require('socket.io')(server);
server.listen(PORT);
let rooms = {};

const playedGames = new Nedb({
    filename: 'data/playedGames.db',
    autoload: true,
    //corruptAlertThreshold: 1
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"))
})
app.get("/le", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/levelEditor/levelEditor.html"))
})
app.get("/reset", function (req, res) {
    rooms = {};
    res.end()
})


app.get("/*", function (req, res) {
    res.status(404);
    res.send("brak strony")

})

setInterval(function () {


    for (let roomID in rooms) {
        let room = rooms[roomID]
        if (room.start) {

            io.sockets.to(room.players[0].client.id).emit("packet", room.packet2);

            io.sockets.to(room.players[1].client.id).emit("packet", room.packet1);
        }
    }


}, 16.6)


io.on('connection', function (client) {
    client.on('Hello', function (data) {
        if (rooms[data.roomID]) {
            if (rooms[data.roomID].players.length < 2) {
                rooms[data.roomID].players.push({client: client, name: data.name})
                rooms[data.roomID].start = true;
                io.sockets.to(client.id).emit("onconnect", {id: 1});
                io.sockets.to(client.id).emit("gameStart", {});
                io.sockets.to(rooms[data.roomID].players[0].client.id).emit("gameStart", {});
            }
            else {
                io.sockets.to(client.id).emit("error", {});

            }
        }

        else {
            rooms[data.roomID] = {
                players: [],
                packet1: {
                    player: {},
                    events: [],
                    mobileCube: {}
                },
                packet2: {
                    player: {},
                    events: [],
                    mobileCube: {}
                },
                start: false
            };
            rooms[data.roomID].players.push({client: client, name: data.name})
            io.sockets.to(client.id).emit("onconnect", {
                id: 0
            });
        }
        console.log(rooms)

    })


    client.on('packet', function (data) {
        if (rooms[data.roomID] && rooms[data.roomID].players.length == 2)
            if (rooms[data.roomID].players[0].client.id == client.id) {
                rooms[data.roomID].packet1 = data.packet;

            }
            else if (rooms[data.roomID].players[1].client.id = client.id) {
                rooms[data.roomID].packet2 = data.packet;

            }
    })


    client.on('lose', function (data) {
        let room = rooms[data.roomID]
        if (!room)
            return
        let obj = {
            status: 'lose',
            timeleft: '0',
            players: [room.players[0].name, room.players[1].name],
            roomID: data.roomID
        }
        playedGames.insert(obj, function (err, newDoc) {
            console.log("Zapisano rozgrywke:")
            console.log(newDoc)

        });
        delete rooms[data.roomID]
    })
    client.on('win', function (data) {
        let room = rooms[data.roomID]
        if (!room)
            return
        let obj = {
            status: 'win',
            timeleft: data.timeLeft,
            players: [room.players[0].name, room.players[1].name],
            roomID: data.roomID
        }
        playedGames.insert(obj, function (err, newDoc) {
            console.log("Zapisano rozgrywke:")
            console.log(newDoc)

        });
        delete rooms[data.roomID]
    })
});