const {PLAYER, PITCH, BALL, GAME, MESSAGE, INPUT_TYPE} = require("../shared/constants");
const Player = require("./player");
const Ball = require("./ball");
const Team = require("./team");
const Perfprmance = require("./performance");
const perf_hooks = require("perf_hooks");

/**
 * Defines game state and behavior.
 */
class Game {
	constructor () {
		/**Save all connections/sockets. Used to send updates*/
		this.sockets = {};
		/**Save all Players instances of current game */
		this.players = {};
		/**Save ball instance of current game */
		this.ball = new Ball();
		/**Timestamp of last update. Used to calculare difference in time between previous and next ticks*/
		this.lastUpdateTime = Date.now();
		/**Teams in game. */
		this.team = {
			blue: new Team(false),
			red: new Team(true),
		};

		this.performance = new Perfprmance();
		// Start updating
		this.interval = setInterval(() => {
			this.update();
		}
		, GAME.SERVER_PING);
	}

	/**
	 * Ticks of the game. Started in constructor, can be paused with this.pause(delay) method
	 */
	update() {
		const start = perf_hooks.performance.now();

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
		this.performance.addPing(perf_hooks.performance.now() - start);
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
		Object.values(this.players).forEach(function (player) {
			player.move(dt);
		});
	}

	/**
	 * Proceess every collision in the game by comparing every pair of entity
	 * @param {number} dt miliseconds since last update 
	 */
	collision(dt) {
		let i = 0;

		for (const socket in this.players) {
			switch (this.isBallTouch(socket, dt)) {
			case 0:
				this.players[socket].speed = PLAYER.SPEED_DEFAULT;
				break;
			case 1: // Just collision
				this.playerTouchBall(socket); //Touch
				break;
			case 2: // Player holds the ball
				this.playerHoldBall(socket);
				break;
			case 3: // Player Hold the ball and shots it in same time
				this.playerKickBall(socket); 
				break;
			case 4:	// Player assist
				this.playerAssistBall(socket); 
				break;
			case 5: // Player force actions
				this.playerInterractBall(socket);
				this.players[socket].speed = PLAYER.SPEED_ON_FORCE_ACTION;
				break;
			}
			this.players[socket].assist = false;
			this.playerPlayerCollision(socket, i);

			i++;
		}
	}

	/**
	 * Sends current state to all sockets in this.sockets object
	 */
	sendUpdate() {
		const update = this.createUpdate();
		Object.keys(this.sockets).forEach((playerID) => {
			const socket = this.sockets[playerID];
			socket.emit(MESSAGE.GAME_UPDATE, update);
		});
	}

	/**
	 * Change ball direction and speed when player touches ball
	 * @param {number} id 
	 */
	playerTouchBall(id) {
		const PowerVector = Math.atan2(this.ball.x - this.players[id].x, this.ball.y - this.players[id].y);
		this.ball.direction = PowerVector;
		this.ball.speed =(((this.players[id].mass - this.ball.mass) *  this.players[id].speed +  2 * this.ball.mass) /  (this.players[id].mass + this.ball.mass)) *2;
	}

	/**
	 * Change ball direction and speed when player holds the ball.  
	 * Ball holds inside the player
	 * @param {number} id 
	 */
	playerHoldBall(id) {
		this.players[id].hold = true;
		this.players[id].speed = PLAYER.SPEED_ON_HOLD;
		this.ball.x = this.players[id].x + PLAYER.RADIUS * Math.sin(this.players[id].direction);
		this.ball.y = this.players[id].y + PLAYER.RADIUS * Math.cos(this.players[id].direction);
		this.ball.direction = this.players[id].direction;
		this.ball.speed = this.players[id].speed;
	}

	/**
	 * Force actions with ball.  
	 * - rotate clockwise
	 * - rotate counterclockwise
	 * - push
	 * - pull
	 * @param {number} id
	 */
	playerInterractBall(id) {
		this.players[ id ].shot = 0;

		const ballY = this.ball.y;
		const ballX = this.ball.x;

		const playerY = this.players[id].y;
		const playerX = this.players[id].x;
		const currentDistance = (ballY - playerY) ** 2 + (ballX - playerX) ** 2;
		
		if (this.players[id].pull) {
			
			if (currentDistance <= PLAYER.DISTANCE_PLAYER_PULL_POWER) {
				this.ball.y -= PLAYER.PULL_FORCE * (ballY - playerY)/Math.abs(ballY - playerY);
				this.ball.x -= PLAYER.PULL_FORCE * (ballX - playerX)/Math.abs(ballX - playerX);
			}
			else if (currentDistance <= PLAYER.DISTANCE_PLAYER_PULL_POWER * 4) {
				this.ball.y -= (PLAYER.PULL_FORCE / 2) * (ballY - playerY)/Math.abs(ballY - playerY);
				this.ball.x -= (PLAYER.PULL_FORCE / 2) * (ballX - playerX)/Math.abs(ballX - playerX);
			}
			return;
		}
		if (this.players[id].rotateClockwise && currentDistance <= PLAYER.DISTANCE_PLAYER_PULL_POWER) {
			this.ball.direction = Math.atan2(this.ball.x - this.players[id].x, this.ball.y - this.players[id].y) + Math.PI / 2;
			this.ball.speed += BALL.BONUS_SPEED_ON_ROTATE; 
			return;
		}
		if (this.players[id].rotateCounterClockwise && currentDistance <= PLAYER.DISTANCE_PLAYER_PULL_POWER) {
			this.ball.direction = Math.atan2(this.ball.x - this.players[id].x, this.ball.y - this.players[id].y) - Math.PI / 2;
			this.ball.speed += BALL.BONUS_SPEED_ON_ROTATE; 
			return;
		}
		if (this.players[id].push && currentDistance <= PLAYER.DISTANCE_PLAYER_PULL_POWER) {
			this.ball.direction = this.players[id].direction;
			this.ball.speed = this.players[id].speed;
		}
	}

	/**
	 * Shot ball with player's direction and shot power that was set by player in the ***catch perfect timing game*** 
	 * @param {number} id 
	 */
	playerKickBall(id) {
		if (this.players[ id ].hold) {
			this.ball.x = this.players[ id ].x + (PLAYER.RADIUS + BALL.RADIUS + 2) * Math.sin(this.players[ id ].direction);
			this.ball.y = this.players[ id ].y + (PLAYER.RADIUS + BALL.RADIUS + 2) * Math.cos(this.players[ id ].direction);
			this.ball.direction = this.players[ id ].direction;
			this.ball.speed = PLAYER.KICK_FORCE * this.players[ id ].shot;
		
			this.players[ id ].shot = 0;
			this.players[ id ].pull = false;
			this.players[ id ].push = false;
			this.players[ id ].assist = false;
			this.players[ id ].hold = false;
		} else {
			this.players[ id ].shot = 0;
			this.players[ id ].hold = 0;
		}
	}

	/**
	 * Assist ball with constant speed and current player's direction 
	 * @param {number} id 
	 */
	playerAssistBall(id){
		this.ball.x = this.players[id].x + (PLAYER.RADIUS + this.ball.radius + 2) * Math.sin(this.players[id].direction);
		this.ball.y = this.players[id].y + (PLAYER.RADIUS + this.ball.radius + 2) * Math.cos(this.players[id].direction);
		this.ball.direction = this.players[id].direction;
		this.ball.speed = PLAYER.ASSIST_FORCE;

		this.players[ id ].shot = 0;
		this.players[ id ].pull = false;
		this.players[ id ].push = false;
		this.players[ id ].assist = false;
		this.players[ id ].hold = false;

	}

	/**
	 * Defines collisions type betweeen ball and player
	 * @param {number} id 
	 * @param {number} dt 
	 * @returns
	 * - 0 - no collision
	 * - 1 - player collides with ball 
	 * - 2 - player hold ball
	 * - 3 - player hold ball and kick it
	 * - 4 - player hold ball and assist it
	 * - 5 - player use force actions
	 */
	isBallTouch(id, dt) {
		const ballY = this.ball.x + dt * this.ball.speed * Math.cos(this.ball.direction);
		const ballX = this.ball.y + dt * this.ball.speed * Math.sin(this.ball.direction);

		const playerY = this.players[id].x + dt * this.players[id].speed * Math.cos(this.players[id].direction);
		const playerX = this.players[id].y + dt * this.players[id].speed * Math.sin(this.players[id].direction);

		const currentDistance = (ballY - playerY) ** 2 + (ballX - playerX) ** 2;

		if (currentDistance <= PLAYER.PLAYER_BALL_COLLISION_DISTANCE) {
			if (this.players[id].pull) {
				if (this.players[id].shot !== 0) {
					return 3;
				} // Player Hold the ball and shots it in same time
				else if (this.players[id].assist === true) {
					return 4;
				} // Player assist
				else {
					return 2;
				} // Player holds the ball
			} else {
				return 1;
			} // Just collision
		} else {
			if (currentDistance <= PLAYER.PLAYER_BALL_HOLD_DISTANCE && this.players[id].pull){
				return 2;
			}
			else if (this.players[id].pull || this.players[id].push || this.players[id].rotateClockwise || this.players[id].rotateCounterClockwise) {
				return 5;
			} // Player force actions
			else {
				return 0;
			} // No collision
		}
	}

	/**
	 * Process collision between player and all other players that is next to him in **this.players{}** object  
	 * @param {number} id player to process
	 * @param {number} index index of player in **this.players{}** object
	 */
	playerPlayerCollision(id, index) {
		let i = 0;
		for (const other in this.players) {
			if (i > index) {
				const currentDistance = (this.players[other].x - this.players[id].x) ** 2 + (this.players[other].y - this.players[id].y) ** 2;
				if (currentDistance <= PLAYER.RADIUS ** 2 * 2) {
					// Process colision = change directions and speed
					const dir = this.players[other].direction;
					this.players[other].direction = this.players[id].direction;
					this.players[id].direction = dir;
				}
			}
			i++;
		}
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
		let red_number = 1;
		let blue_number = 1;

		for (const socket in this.players) {
			// For blue tam
			if (this.players[socket].team) {
				this.players[socket].x = (PITCH.FULL_X / 2) * (blue_number / 3);
				this.players[socket].y = PITCH.FULL_Y / 2;
				blue_number++;
			} else if (!this.players[socket].team) {
				this.players[socket].x = PITCH.FULL_X / 2 + (PITCH.FULL_X / 2) * (red_number / 3);
				this.players[socket].y = PITCH.FULL_Y / 2;
				red_number++;
			}

			this.players[socket].speed = 0;
			this.players[socket].pull = false;
			this.players[socket].push = false;
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

		
		Object.keys(this.sockets).forEach((playerID) => {
			const socket = this.sockets[playerID];
			socket.emit(MESSAGE.GOAL, res);
		});
		
		this.sendUpdate();
		this.pause(GAME.AFTER_GOAL_DELAY_MS); // Pause the game after goal
	}

	/**
	 * Pasuse game for `delay` time
	 * @param {number} delay in miliseconds 
	 */
	pause(delay) {
		clearInterval(this.interval);
		setTimeout(() => {
			this.lastUpdateTime = Date.now();
			this.interval = setInterval(() => {
				this.update();
			}, GAME.SERVER_PING);
		}, delay);
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
		else
			this.players[id.id][message.inputType] = message.res;	

	}
	
	/**
	 * Create Update message for all players - description of current state of the game
	 * @returns {object} description of the game
	 */
	createUpdate() {
		return {
			timestamp: Date.now(),
			ball: this.ball,
			players: Object.values(this.players).map((player) => {
				return {
					x: player.x,
					y: player.y,
					socket: player.socket,
					team: player.team,
				};
			}),
		};
	}

	/**
	 * Add Player to the **this.sockets{}** and **this.players{}** objects
	 * @param {Socket} socket 
	 * @param {string} nickname 
	 */
	addPlayer(socket, nickname) {
		const team = Object.keys(this.players).length % 2;
		if(team)
			this.team.blue.addPlayer();
		else
			this.team.red.addPlayer();
		
			
		// Add player to global players array
		this.players[socket.id] = new Player(socket.id, nickname, 0, 0, team);
		this.sockets[socket.id] = socket;
		
		const teamName = team ? "BLUE".blue : "RED ".red;
		console.log(teamName + ":    " + nickname.bold + ":  connected on socket: " + socket.id);
	}

	/**
	 * Remove Player to the **this.sockets{}** and **this.players{}** objects
	 * @param {Socket} socket 
	 * @returns 
	 */
	removePlayer(socket) {
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

module.exports = Game;