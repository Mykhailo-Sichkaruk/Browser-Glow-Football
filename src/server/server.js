const { DEVELOP, MESSAGE } = require("../shared/constants");
require("colors");
const express = require("express");
const app = express();
// file deepcode ignore HttpToHttps: <please specify a reason of ignoring this>
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Game = require("./game");
const game = new Game();

// Start server listening
server.listen(DEVELOP.SERVER_PORT, DEVELOP.SERVER_ADRESS_IPV4);
// Start hosting game page on `server_adress:3000`
app.use(express.static(DEVELOP.SITE_FOLDER_NAME));
//Print server info
console.log("Server running on : ".green + DEVELOP.SERVER_ADRESS_IPV4.white + ":" + `${DEVELOP.SERVER_PORT}`.cyan);

// Set server to listen for messages from clients
io.on(MESSAGE.CONNECTION, socket => {
	console.log("Player connected! ".white + socket.id.grey);
	socket.on(MESSAGE.JOIN_GAME, 	joinGame);
	socket.on(MESSAGE.DISCONNECT,  	disconnect);
	socket.on(MESSAGE.INPUT,  		handleInput);
});


function disconnect() {
	game.disconnectPlayer(this);
}

function joinGame(username) {
	game.joinPlayer(this, username);
}

function handleInput(msg) {
	game.handleInput(this, msg);
}
