"use strict";

const Constants = require("../shared/constants");
require("colors");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Game = require("./game");
let game = new Game();


server.listen(Constants.DEVELOP.SERVER_PORT, Constants.DEVELOP.SERVER_ADRESS_IPv4);
app.use(express.static(Constants.DEVELOP.SITE_FOLDER_NAME));
console.log("Server running on : ".green + Constants.DEVELOP.SERVER_ADRESS_IPv4.white + ":" + `${Constants.DEVELOP.SERVER_PORT}`.cyan);

io.on(Constants.MSG_TYPE.CONNECTION, socket => {
	console.log("Player connected! ".white + socket.id.grey);
	socket.on(Constants.MSG_TYPE.JOIN_GAME, 	joinGame);
	socket.on(Constants.MSG_TYPE.DISCONNECT,  	onDisconnect);
	socket.on(Constants.MSG_TYPE.INPUT,  		handleInput);
});


function onDisconnect() {
	game.removePlayer(this);
}

function joinGame(username) {
	game.addPlayer(this, username);
}

function handleInput(msg) {
	game.handleInput(this, msg);
}