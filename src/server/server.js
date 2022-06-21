

const { DEVELOP, MESSAGE, } = require("../shared/constants");
require("colors");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Game = require("./game");
const game = new Game();

// Start Websoket server
server.listen(DEVELOP.SERVER_PORT, DEVELOP.SERVER_ADRESS_IPV4);
// Start hosting game on webpage
app.use(express.static(DEVELOP.SITE_FOLDER_NAME));
console.log("Server running on : ".green + DEVELOP.SERVER_ADRESS_IPV4.white + ":" + `${DEVELOP.SERVER_PORT}`.cyan);

// Set server to listen for messages from clients
io.on(MESSAGE.CONNECTION, socket => {
	console.log("Player connected! ".white + socket.id.grey);
	socket.on(MESSAGE.JOIN_GAME, 	joinGame);
	socket.on(MESSAGE.DISCONNECT,  	disconnect);
	socket.on(MESSAGE.INPUT,  		handleInput);
});


function disconnect() {
	game.removePlayer(this);
}

function joinGame(username) {
	game.addPlayer(this, username);
}

function handleInput(msg) {
	game.handleInput(this, msg);
}
