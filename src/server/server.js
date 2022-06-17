"use strict";

const {DEVELOP, MESSAGE, } = require("../shared/constants");
require("colors");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Game = require("./game");
let game = new Game();


server.listen(DEVELOP.SERVER_PORT, DEVELOP.SERVER_ADRESS_IPv4);
app.use(express.static(DEVELOP.SITE_FOLDER_NAME));
console.log("Server running on : ".green + DEVELOP.SERVER_ADRESS_IPv4.white + ":" + `${DEVELOP.SERVER_PORT}`.cyan);

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