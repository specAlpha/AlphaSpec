const http = require("http");

const path = require("path")

const levelFolder = './public/Levels/';
const fs = require('fs');

const express = require("express")
const PORT = 3000;
var mongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID;
var Operations = require("./modules/Operations.js")

var opers = new Operations();
const app = express();
app.use(express.static('public'))
const server = require('http').Server(app);
const io = require('socket.io')(server);
server.listen(PORT);
let rooms = [];
let id = 0;


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"))
})
app.get("/le", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/levelEditor/levelEditor.html"))
})
app.get("/scores", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/Scores/index.html"))
})
app.post("/refresh", function (req, res) {
    mongoClient.connect("mongodb://localhost/AlphaSpec", function (err, db) {
        if (err) console.log(err)
        else {
            if (db.collection('lastGames'))
                opers.SelectAll(db.collection('lastGames'), function (data) {
                    db.close();
                    res.end(JSON.stringify(data));

                });
            else {
                db.close();
                res.end([])
            }

        }

    })


})

app.get("/*", function (req, res) {
    res.status(404);
    res.send("brak strony")

})

function findRoomByID(id) {
    for (let room of rooms) {
        if (room.roomID == id)
            return room
    }
    return null;

}

function findroomByClientID(id) {
    for (let room of rooms) {
        for (let player of room.players)
            if (player.client.id == id) {
                return room
            }
    }
    return null;
}

function addToDataBase(doc) {
    mongoClient.connect("mongodb://localhost/AlphaSpec", function (err, db) {
        if (err) console.log(err)
        else {
            if (db.collection('lastGames')) {
                opers.Insert(db.collection('lastGames'), doc, function () {
                    db.close();
                })
            }

            else {
                db.createCollection('lastGames', function (err, coll) {
                    opers.Insert(db.collection('lastGames'), doc, function () {
                        db.close();
                    })
                })


            }

        }

    })
}

setInterval(function () {


    for (let room of rooms) {

        if (room.start) {

            io.sockets.to(room.players[0].client.id).emit("packet", room.packet2);

            io.sockets.to(room.players[1].client.id).emit("packet", room.packet1);
        }
    }


}, 16.6)


io.on('connection', function (client) {
    client.on('createRoom', function (data) {
        id++;
        let room = {
            roomID: id,
            roomName: data.roomName,
            players: [{client: client, name: data.name}],
            start: false,
            map: data.map,
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

        }
        io.sockets.to(client.id).emit("createRoom", {id: 0, roomID: room.roomID});
        rooms.push(room);


    })

    client.on("showRooms", function () {
        let obj = {
            rooms: []
        }
        for (let room of rooms) {
            if (!room.start) {
                let a = {roomID: room.roomID, roomName: room.roomName}
                obj.rooms.push(a);
            }
        }
        io.sockets.to(client.id).emit("showRooms", obj);

    })
    client.on("showMaps", function () {
        let obj = {
            maps: []
        }

        fs.readdir(levelFolder, (err, files) => {

            for (let file of files)
                obj.maps.push(file)

            io.sockets.to(client.id).emit("showMaps", obj);

        })


    })
    client.on('joinRoom', function (data) {
        let room = findRoomByID(data.roomID)
        console.log('joining')

        if (room && !room.start) {
            room.players.push({client: client, name: data.name})
            room.start = true;
            io.sockets.to(client.id).emit("joinRoom", {id: 1, roomID: room.roomID});
            io.sockets.to(room.players[0].client.id).emit("gameStart", {map: room.map});
            io.sockets.to(room.players[1].client.id).emit("gameStart", {map: room.map});
        }
        else
            io.sockets.to(client.id).emit("error", {});


    })


    client.on('packet', function (data) {
        let room = findRoomByID(data.roomID)
        if (room && room.start)
            if (room.players[0].client.id == client.id) {
                room.packet1 = data.packet;
            }
            else if (room.players[1].client.id = client.id) {
                room.packet2 = data.packet;

            }
    })


    client.on('lose', function (data) {
        let room = findRoomByID(data.roomID)
        if (!room)
            return
        let obj = {
            status: 'lose',
            timeleft: '0',
            players: [room.players[0].name, room.players[1].name],
            roomName: room.roomName
        }
        addToDataBase(obj)
        rooms.splice(rooms.indexOf(room), 1);
    })
    client.on('win', function (data) {
        let room = findRoomByID(data.roomID)
        if (!room)
            return
        let obj = {
            status: 'win',
            timeleft: data.timeLeft,
            players: [room.players[0].name, room.players[1].name],
            roomName: room.roomName
        }
        addToDataBase(obj)
        console.log('win')
        rooms.splice(rooms.indexOf(room), 1);
    })

    client.on("disconnect", function () {
        console.log('disconnetc')
        let room = findroomByClientID(client.id);
        console.log(room)
        if (room) {
            for (let player of room.players) {
                if (player.client.id != client.id) {
                    io.sockets.to(player.client.id).emit("disconnected", {});
                }
            }
            rooms.splice(rooms.indexOf(room), 1);
        }
    })


})

;