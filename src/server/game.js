import  { INPUT_TYPE, GAME, MESSAGE } from "../shared/constants.js";
import Collision from "./collision.js";
import Player from "./player.js";
import Team from "./team.js";
import Ball from "./ball.js";
import Performance from "./performance.js";
import chalk from "chalk";
import { io } from "./server.js";

/**
 * Defines game state and behavior.
 */
class Game extends Collision {
	constructor(id) {
		super();
		/** Id of room in socket server */
		this.id = id;
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
		/** Node.js timer to start/stop game loop */
		this.interval = setInterval(() => { this.update(); }, GAME.SERVER_PING); // Start game loop
	}

	/**
	 * Ticks of the game.
	 * Started in constructor, can be paused with this.pause(delay) method
	 */
	update() {
		// Calculate time difference between last update and current update
		const dt = (Date.now() - this.lastUpdateTime) / 1000;
		// Process colision
		this.collision(dt);
		// Process movement
		this.move(dt);
		// Send update to all players
		this.sendUpdate();
		// Save time of last update
		this.lastUpdateTime = Date.now();
	}

	/**
	 * Moves all movable entities on the pitch
	 * @param {number} dt miliseconds since last update
	 */
	move(dt) {
		// Move ball
		const res = this.ball.move(dt);
		if (res !== undefined) {
			this.onGoal(res);
			return;
		}
		// Move all players
		for (const player in this.players)
			this.players[ player ].move(dt);
	}

	/**
	 * Change score and move players in default positions after goal
	 * @param {boolean} team - team that scored, ***true*** for blue team, ***false*** for red team
	 */
	onGoal(team) {
		// Set ball in center of the pitch
		this.ball.setInCenter();
		// Set Players to teir start positions after goal
		for (const player in this.players) {
			this.players[ player ].setStartPosition();
		}

		// Change score
		if (team)
			this.team.blue.addScore();
		else
			this.team.red.addScore();

		// Create content for message
		const content = {
			teamScored: team,
			blueScore: this.team.blue.getScore(),
			redScore: this.team.red.getScore(),
		};
		// Send message to all players in room
		io.in(this.id).emit(MESSAGE.GOAL, content);

		this.pause(GAME.AFTER_GOAL_DELAY); // Pause the game after goal
	}

	/**
	 * Pasuse game for `delay` time
	 * @param {number} delay miliseconds to pause
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
		io.in(this.id).emit(MESSAGE.GAME_UPDATE, update);
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
		let teamPosition;
		if (team) {
			this.team.blue.incrementPlayers();
			teamPosition = this.team.blue.getPlayersCount();
		} else {
			this.team.red.incrementPlayers();
			teamPosition = this.team.red.getPlayersCount();
		}

		// Add player to global players array
		this.players[socket.id] = new Player(socket.id, nickname, team, teamPosition);
		this.sockets[socket.id] = socket;

		const teamName = team ? chalk.blue("BLUE") : chalk.red("RED ");
		console.log(chalk.yellow(this.id) + " " + teamName + ":\t" + chalk.bold("\"" + nickname + "\"") + ":  connected on socket: " + chalk.grey(socket.id));
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

	isFree() {
		return Object.keys(this.players).length < GAME.MAX_PLAYERS;
	}

}

export default Game;
