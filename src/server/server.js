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

const port = 3000;
const adress_IPv4 = "localhost";

server.listen(port, adress_IPv4);
app.use(express.static("dist"));
console.log("Server running on : ".green + adress_IPv4.white + ":" + `${port}`.cyan);

io.on("connection", socket => {
	console.log("Player connected! ".white + socket.id.grey);
	socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
	socket.on(Constants.MSG_TYPES.INPUT, 	   handleKeyboardInput);
	socket.on(Constants.MSG_TYPES.MOUSE_INPUT, handleMouseInput);
	socket.on(Constants.MSG_TYPES.LMB_CLICK,   handleLMBClick);
	socket.on(Constants.MSG_TYPES.RMB_CLICK,   handleRMBClick);
	socket.on(Constants.MSG_TYPES.DISCONNECT,  onDisconnect);
	socket.on(Constants.MSG_TYPES.KEY_SPACE,   handleKeySpace);
	socket.on(Constants.MSG_TYPES.KEY_SHIFT,   handleKeyShift);
	socket.on(Constants.MSG_TYPES.KEY_W, 	   handleKeyW);
	socket.on(Constants.MSG_TYPES.KEY_A, 	   handleKeyA);
	socket.on(Constants.MSG_TYPES.KEY_D, 	   handleKeyD);
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

function handleKeySpace(res){
	game.handleKeySpace(this, res);
}

function handleKeyShift(res){
	game.handleKeyShift(this, res);
}

function handleKeyW(res) {
	game.handleKeyW(this, res);
}

function handleKeyA(res) {
	game.handleKeyA(this, res);
}

function handleKeyD(res) {
	game.handleKeyD(this, res);
}

function handleLMBClick(res){
	game.handleLMBClick(this, res);
}

function handleRMBClick(res){
	game.handleRMBClick(this, res);
}