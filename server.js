const http = require("http");

const path = require("path")

const express = require("express")
const PORT = 3000
//process.env.PORT || 8080
var app = express();

app.use(express.static('public'))
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"))
})
app.get("/le", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/levelEditor/levelEditor.html"))
})

app.get("/*", function (req, res) {
    res.status(404);
    res.send("brak strony")

})


app.listen(PORT, function () {
    console.log("start serwera na porcie ")
})