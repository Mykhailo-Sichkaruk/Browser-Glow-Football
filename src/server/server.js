import express from "express";
import { DEVELOP, MESSAGE } from "../shared/constants.js";
import { Game } from "./game.js";
import chalk from "chalk";
import http from "http";
import { Server } from "socket.io";

const app = express();
// file deepcode ignore HttpToHttps: <please specify a reason of ignoring this>
const server = http.createServer(app);
const io = new Server(server);
const game = new Game();

// Start server listening
server.listen(DEVELOP.SERVER_PORT, DEVELOP.SERVER_ADRESS_IPV4);
// Start hosting game page on `server_adress:3000`
app.use(express.static(DEVELOP.SITE_FOLDER_NAME));
//Print server info
console.log(chalk.greenBright("Server running on : ") + chalk.white(DEVELOP.SERVER_ADRESS_IPV4) + ":" + chalk.cyan(`${DEVELOP.SERVER_PORT}`));

// Set server to listen for messages from clients
io.on(MESSAGE.CONNECTION, socket => {
	console.log("Player connected! " + chalk.grey(socket.id));
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
