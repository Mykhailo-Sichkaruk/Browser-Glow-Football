import express from "express";
import { DEVELOP, MESSAGE } from "../shared/constants.js";
import Game from "./game.js";
import chalk from "chalk";
import http from "http";
import { Server } from "socket.io";

// file deepcode ignore PureMethodReturnValueIgnored: <please specify a reason of ignoring this>

// file deepcode ignore UseCsurfForExpress: <please specify a reason of ignoring this>, file deepcode ignore DisablePoweredBy: <please specify a reason of ignoring this>, file deepcode ignore DisablePoweredBy: <please specify a reason of ignoring this>
// deepcode ignore UseCsurfForExpress: <please specify a reason of ignoring this>
const app = express();
const server = http.createServer(app);
export const io = new Server(server);

const games = {};

// Start server listening
server.listen(DEVELOP.SERVER_PORT);
// Start hosting game page on `server_adress:3000`
app.use(express.static(DEVELOP.SITE_FOLDER_NAME));
//Print server info
console.log(chalk.greenBright("Server running on : ") + chalk.white(DEVELOP.SERVER_ADRESS_IPV4) + ":" + chalk.cyan(`${DEVELOP.SERVER_PORT}`));

const rand = () => Math.random().toString(16).substr(2, 8);

// Set Websockets server to listen for messages from clients
io.on(MESSAGE.CONNECTION, socket => {
	console.log("Player connected! " + chalk.grey(socket.id));
	socket.on(MESSAGE.JOIN_GAME, joinGame);
});

/**
 * Return id of new game or id of existing game
 * Create new game if there is no free game
 * Free game is game with players count less than GAME.MAX_PLAYERS
 * @returns {string} - id of game
 */
function getFreeGameId() {
	for (const game in games)
		if (games[game].isFree())
			return games[game].id;

	const id = rand();
	games[ id ] = new Game(id);
	console.log(chalk.yellowBright("Game created! ") + chalk.white(id));
	return id;
}

function disconnect() {
	games[this.roomId].disconnectPlayer(this);
}

function joinGame(username) {
	// Get free game id
	const id = getFreeGameId();
	// Join socket to room
	this.join(id);
	// Save id in socket object
	this.roomId = id;
	// Add player to game with id
	games[ id ].joinPlayer(this, username);
	// Start listening for messages from client
	this.on(MESSAGE.INPUT, handleInput);
	this.on(MESSAGE.DISCONNECT, disconnect);
}

function handleInput(msg) {
	games[this.roomId].handleInput(this, msg);
}
