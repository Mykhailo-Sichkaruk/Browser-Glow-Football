const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const colors = require('colors');
const Constants = require('../shared/constants');
const Game = require('./game');
let game = new Game();

let port = 3000;
let adress_IPv4 = 'localhost';
//server.listen(3000, '192.168.31.137');
server.listen(port, adress_IPv4);
app.use(express.static('dist'));
console.log('Server running on : '.green + adress_IPv4.white + ':' + `${port}`.cyan);


io.on('connection', socket => {
    console.log('Player connected! '.white + socket.id.grey);

    socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
    socket.on(Constants.MSG_TYPES.INPUT, handleKeyboardInput);
    socket.on(Constants.MSG_TYPES.MOUSE_INPUT, handleMouseInput);
    socket.on(Constants.MSG_TYPES.DISCINNECT, onDisconnect);
    socket.on(Constants.MSG_TYPES.PING, (msg => {
        io.emit(Constants.MSG_TYPES.PING, msg);
    }));
});


function onDisconnect() {
    game.removePlayer(this);
}

function joinGame(username) {
    game.addPlayer(this, username);
}

function handleKeyboardInput(res) {
    game.handleKeyboardInput(this, res);
}

function handleMouseInput(res) {
    game.handleMouseInput(this, res);
}