const http = require("http");

const path = require("path")


const express = require("express")
const PORT = process.env.PORT || 80

var app = express();
app.use(express.static('public'))
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(PORT);
let players = [];
let packet1 = {
    player: {},
    events: [],
    mobileCube: {}
};
let packet2 = {
    player: {},
    events: [],
    mobileCube: {}
};

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"))
})
app.get("/le", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/levelEditor/levelEditor.html"))
})
app.get("/reset", function (req, res) {
    players = [];
    res.end()
})


app.get("/*", function (req, res) {
    res.status(404);
    res.send("brak strony")

})

setInterval(function () {
    if (players[0])
        io.sockets.to(players[0].id).emit("packet", packet2);
    if (players[1])
        io.sockets.to(players[1].id).emit("packet", packet1);

}, 16.6)


io.on('connection', function (client) {
    if (players.length == 0) {
        players.push(client);
        io.sockets.to(client.id).emit("onconnect", {
            id: 0
        });
    }
    else if (players.length == 1) {
        players.push(client);
        io.sockets.to(client.id).emit("onconnect", {
            id: 1
        });

    }

    client.on('packet', function (data) {
        if (players[0].id == client.id) {
            packet1 = data;

        }
        else if (players[1].id == client.id) {
            packet2 = data;

        }
    })
});