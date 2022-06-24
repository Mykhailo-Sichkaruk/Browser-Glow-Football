import * as PerfHooks from "perf_hooks";
import  { PITCH, INPUT_TYPE, GAME, MESSAGE } from "../shared/constants.js";
import Collision from "./collision.js";
import Player from "./player.js";
import Team from "./team.js";
import Ball from "./ball.js";
import Performance from "./performance.js";
import chalk from "chalk";

// const Player = require("./player");
// const Ball = require("./ball");
// const Team = require("./team");
// const Performance = require("./performance");
// const PerfHooks = require("perf_hooks");

/**
 * Defines game state and behavior.
 */
export class Game extends Collision {
	constructor() {
		super();
		/**Save all connections/sockets. Used to send updates*/
		this.sockets = {};
		/**Save all Players instances of current game */
		this.players = {};
		/**Save ball instance of current game */
		this.ball = new Ball();
		/**Timestamp of last update. Used to calculare difference in time between prev and next ticks*/
		this.lastUpdateTime = Date.now();
		/**Teams in game. */
		this.team = {
			blue: new Team(false),
			red: new Team(true),
		};
		/** Performance object*/
		this.performance = new Performance();
		// Start updating
		this.interval = setInterval(() => {
			this.update();
		}
		, GAME.SERVER_PING);
	}

	/**
	 * Ticks of the game.
	 * Started in constructor, can be paused with this.pause(delay) method
	 */
	update() {
		const start = PerfHooks.performance.now();

		const dt = (Date.now() - this.lastUpdateTime) / 1000;
		// Process colision
		this.collision(dt);
		// Process movement
		this.move(dt);
		// Send update to all players
		this.sendUpdate();
		// Save time of last update
		this.lastUpdateTime = Date.now();
		// Save performance
		this.performance.addPing(PerfHooks.performance.now() - start);
	}

	/**
	 * Moves all movable entities on the pitch
	 * @param {number} dt miliseconds since last update
	 */
	move(dt) {
		// Move ball
		let res;
		if ((res = this.ball.move(dt)) === 2) {
			this.onGoal(true);
		} else if (res === 1) {
			this.onGoal(false);
		}
		// Move all players
		for (const player in this.players)
			this.players[ player ].move(dt);
	}

	/**
	 * Change score and move players in default positions after goal
	 * @param {boolean} team
	 */
	onGoal(team) {
		// Set ball to center
		this.ball.x = PITCH.FULL_X / 2;
		this.ball.y = PITCH.FULL_Y / 2;
		this.ball.speed = 0;
		// Set Players to start
		let redIndex = 1;
		let blueIndex = 1;

		for (const socket in this.players) {
			// For blue tam
			if (this.players[socket].team) {
				this.players[socket].x = (PITCH.FULL_X / 2) * (blueIndex / 3);
				this.players[socket].y = PITCH.FULL_Y / 2;
				blueIndex++;
			} else if (!this.players[socket].team) {
				this.players[socket].x = PITCH.FULL_X / 2 + (PITCH.FULL_X / 2) * (redIndex / 3);
				this.players[socket].y = PITCH.FULL_Y / 2;
				redIndex++;
			}
		}

		let res;
		if (team === true) {
			this.team.red.addScore();
			res = {
				redTeamScored: false,
				blue: this.team.blue.getScore(),
				red: this.team.red.getScore(),
			};
		} else {
			this.team.blue.addScore();
			res = {
				redTeamScored: true,
				blue: this.team.blue.getScore(),
				red: this.team.red.getScore(),
			};
		}

		for (const socket in this.players)
			this.sockets[ socket ].emit(MESSAGE.GOAL, res);


		this.sendUpdate();
		this.pause(GAME.AFTER_GOAL_DELAY_MS); // Pause the game after goal
	}

	/**
	 * Pasuse game for `delay` time
	 * @param {number} delay in miliseconds
	 */
	pause(delay) {
		//Stop the game
		clearInterval(this.interval);
		// Wait for delay and start the game again
		setTimeout(() => {
			this.lastUpdateTime = Date.now();
			this.interval = setInterval(() => {
				this.update();
			}, GAME.SERVER_PING);
		}, delay);
	}

	/**
	 * Create Update message for all players - description of current state of the game
	 * @returns {object} description of the game
	 */
	createUpdate() {
		return {
			timestamp: Date.now(),
			ball: this.ball,
			players: Object.values(this.players).map(player => ({
				x: player.x,
				y: player.y,
				socket: player.socket,
				team: player.team,
			})),
		};
	}

	/**
	 * Sends current state to all sockets in this.sockets object
	 */
	sendUpdate() {
		const update = this.createUpdate();
		for (const socket in this.players)
			this.sockets[ socket ].emit(MESSAGE.GAME_UPDATE, update);
	}

	/**
	 * Change player's force actions with new in `message`
	 * @param {number} id
	 * @param {object} message
	 * @returns
	 */
	handleInput(id, message) {
		if (!Object.prototype.hasOwnProperty.call(this.players, `${id.id}`))
			return;

		if (message.inputType === INPUT_TYPE.KEY)
			for (const key in message.res) {
				this.players[id.id][key] = message.res[key];
			}
		else {
			this.players[id.id][message.inputType] = message.res;
		}
	}

	/**
	 * Add Player to the **this.sockets{}** and **this.players{}** objects
	 * @param {Socket} socket
	 * @param {string} nickname
	 */
	joinPlayer(socket, nickname) {
		const team = Object.keys(this.players).length % 2;
		if (team)
			this.team.blue.incrementPlayers();
		else
			this.team.red.incrementPlayers();

		// Add player to global players array
		this.players[socket.id] = new Player(socket.id, nickname, 0, 0, team);
		this.sockets[socket.id] = socket;

		const teamName = team ? chalk.blue("BLUE") : chalk.red("RED ");
		console.log(teamName + ":    " + chalk.bold(nickname) + ":  connected on socket: " + socket.id);
	}

	/**
	 * Remove Player to the **this.sockets{}** and **this.players{}** objects
	 * @param {Socket} socket
	 * @returns
	 */
	disconnectPlayer(socket) {
		if (!Object.prototype.hasOwnProperty.call(this.players, `${socket.id}`))
			return;

		if (this.players[socket.id].team)
			this.team.blue.removePlayer();
		else
			this.team.red.removePlayer();

		delete this.sockets[ socket.id ];
		delete this.players[ socket.id ];
	}

}

