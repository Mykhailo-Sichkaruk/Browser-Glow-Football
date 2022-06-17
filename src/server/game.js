const {PLAYER, PITCH, BALL, GAME, MESSAGE, INPUT_TYPE} = require("../shared/constants");
const Player = require("./player");
const Ball = require("./ball");
const Team = require("./team");
const perf_hooks = require("perf_hooks");

class Game {
	constructor () {
		/**Save all connections/sockets. Used to send update*/
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

		this.performance = {
			update: {
				sum: 0,
				avg: 0,
				max: 0,
				counter: 0,
			},
		};
		// Start updating
		this.interval = setInterval(() => {
			this.update();
		}
		, GAME.SERVER_PING);
	}

	update() {
		const start = perf_hooks.performance.now();

		const dt = (Date.now() - this.lastUpdateTime) / 1000;
		// Process colision
		this.colision(dt);
		// Process movement
		this.move(dt);
		// Send update to all players
		this.sendUpdate();
		// Save time of last update
		this.lastUpdateTime = Date.now();
		
		const end = perf_hooks.performance.now();
		this.performanceAddtime(end - start);
	}

	move(dt) {
		// Move ball
		let res;
		if ((res = this.ball.move(dt)) === 2) {
			this.goal(true);
		} else if (res === 1) {
			this.goal(false);
		}
		// Move all players
		Object.values(this.players).forEach(function (player) {
			player.move(dt);
		});
	}

	colision(dt) {
		let i = 0;

		for (const socket in this.players) {
			switch (this.isBallTouch(socket, dt)) {
			case 0:
				this.players[socket].speed = PLAYER.SPEED_DEFAULT;
				break;
			case 1:
				this.playerTouchBall(socket); //Touch
				break;
			case 2:
				this.playerHoldBall(socket);
				break;
			case 3:
				this.playerShotBall(socket); // Shot
				break;
			case 4:
				this.playerAssistBall(socket); // Assist
				break;
			case 5:
				this.playerInterractBall(socket);
				this.players[socket].speed = PLAYER.SPEED_ON_FORCE_ACTION;
				break;
			}
			this.players[socket].assist = false;
			this.playerPlayerCollision(socket, i);

			i++;
		}
	}

	sendUpdate() {
		const update = this.createUpdate();
		Object.keys(this.sockets).forEach((playerID) => {
			const socket = this.sockets[playerID];
			socket.emit(MESSAGE.GAME_UPDATE, update);
		});
	}

	playerTouchBall(player) {
		const PowerVector = Math.atan2(this.ball.x - this.players[player].x, this.ball.y - this.players[player].y);
		this.ball.direction = PowerVector;
		this.ball.speed =(((this.players[player].mass - this.ball.mass) *  this.players[player].speed +  2 * this.ball.mass) /  (this.players[player].mass + this.ball.mass)) *2;
	}

	playerHoldBall(socket) {
		this.players[socket].speed = PLAYER.SPEED_ON_HOLD;
		this.ball.x = this.players[socket].x + PLAYER.RADIUS * Math.sin(this.players[socket].direction);
		this.ball.y = this.players[socket].y + PLAYER.RADIUS * Math.cos(this.players[socket].direction);
		this.ball.direction = this.players[socket].direction;
		this.ball.speed = this.players[socket].speed;
	}

	playerInterractBall(socket) {
		const ballY = this.ball.y;
		const ballX = this.ball.x;

		const playerY = this.players[socket].y;
		const playerX = this.players[socket].x;
		const currentDistance = (ballY - playerY) ** 2 + (ballX - playerX) ** 2;
		
		if (this.players[socket].pull) {
			
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
		if (this.players[socket].rotateClockwise && currentDistance <= PLAYER.DISTANCE_PLAYER_PULL_POWER) {
			this.ball.direction = Math.atan2(this.ball.x - this.players[socket].x, this.ball.y - this.players[socket].y) + Math.PI / 2;
			this.ball.speed += BALL.BONUS_SPEED_ON_ROTATE; 
			return;
		}
		if (this.players[socket].rotateCounterClockwise && currentDistance <= PLAYER.DISTANCE_PLAYER_PULL_POWER) {
			this.ball.direction = Math.atan2(this.ball.x - this.players[socket].x, this.ball.y - this.players[socket].y) - Math.PI / 2;
			this.ball.speed += BALL.BONUS_SPEED_ON_ROTATE; 
			return;
		}
		if (this.players[socket].push && currentDistance <= PLAYER.DISTANCE_PLAYER_PULL_POWER) {
			this.ball.direction = this.players[socket].direction;
			this.ball.speed = this.players[socket].speed;
		}
	}

	playerShotBall(socket) {
		this.ball.x = this.players[socket].x + (PLAYER.RADIUS + this.ball.radius + 2) * Math.sin(this.players[socket].direction);
		this.ball.y = this.players[socket].y + (PLAYER.RADIUS + this.ball.radius + 2) * Math.cos(this.players[socket].direction);
		this.ball.direction = this.players[socket].direction;
		this.ball.speed = PLAYER.SHOT_FORCE;
		this.players[socket].shot = 0;
		this.players[socket].pull = false;
		this.players[socket].push = false;
		this.players[socket].assist = false;
	}

	playerAssistBall(socket) {
		this.ball.x = this.players[socket].x + (PLAYER.RADIUS + this.ball.radius + 2) * Math.sin(this.players[socket].direction);
		this.ball.y = this.players[socket].y + (PLAYER.RADIUS + this.ball.radius + 2) * Math.cos(this.players[socket].direction);
		this.ball.direction = this.players[socket].direction;
		this.ball.speed = PLAYER.ASSIST_FORCE;

		this.players[socket].pull = false;
	}

	isBallTouch(socket, dt) {
		const ballY = this.ball.x + dt * this.ball.speed * Math.cos(this.ball.direction);
		const ballX = this.ball.y + dt * this.ball.speed * Math.sin(this.ball.direction);

		const playerY = this.players[socket].x + dt * this.players[socket].speed * Math.cos(this.players[socket].direction);
		const playerX = this.players[socket].y + dt * this.players[socket].speed * Math.sin(this.players[socket].direction);

		const currentDistance = (ballY - playerY) ** 2 + (ballX - playerX) ** 2;

		if (currentDistance <= PLAYER.PLAYER_BALL_COLLISION_DISTANCE) {
			if (this.players[socket].pull) {
				if (this.players[socket].shot !== 0) {
					return 3;
				} // Player Hold the ball and shots it in same time
				else if (this.players[socket].assist === true) {
					return 4;
				} // Player assist
				else {
					return 2;
				} // Player holds the ball
			} else {
				return 1;
			} // Just collision
		} else {
			if (currentDistance <= PLAYER.PLAYER_BALL_HOLD_DISTANCE && this.players[socket].pull){
				return 2;
			}
			else if (this.players[socket].pull || this.players[socket].push || this.players[socket].rotateClockwise || this.players[socket].rotateCounterClockwise) {
				return 5;
			} // Player gets Nitro
			else {
				return 0;
			} // No collision
		}
	}

	playerPlayerCollision(player, me_index) {
		let i = 0;
		for (const other in this.players) {
			if (i > me_index) {
				const current_distance = (this.players[other].x - this.players[player].x) ** 2 + (this.players[other].y - this.players[player].y) ** 2;
				if (current_distance <= PLAYER.RADIUS ** 2 * 2) {
					// Process colision = change directions and speed
					const dir = this.players[other].direction;
					this.players[other].direction = this.players[player].direction;
					this.players[player].direction = dir;
				}
			}
			i++;
		}
	}

	goal(team) {
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
				this.players[socket].x =
          (PITCH.FULL_X / 2) * (blue_number / 3);
				this.players[socket].y = PITCH.FULL_Y / 2;
				blue_number++;
			} else if (!this.players[socket].team) {
				this.players[socket].x =
          PITCH.FULL_X / 2 +
          (PITCH.FULL_X / 2) * (red_number / 3);
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

	pause(delay) {
		clearInterval(this.interval);
		setTimeout(() => {
			this.lastUpdateTime = Date.now();
			this.interval = setInterval(() => {
				this.update();
			}, GAME.SERVER_PING);
		}, delay);
	}

	handleInput(socket, msg) {
		if (!Object.prototype.hasOwnProperty.call(this.players, `${socket.id}`))
			return;
		
		if (msg.inputType === INPUT_TYPE.KEY)
			for (let key in msg.res) {
				this.players[socket.id][key] = msg.res[key];	
			}
		else
			this.players[socket.id][msg.inputType] = msg.res;	

	}
	
	createUpdate() {
		return {
			t: Date.now(),
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
	
	performanceAddtime(time) {
		this.performance.update.sum += time;
		
		if (this.performance.update.counter++ >= 1000 / GAME.SERVER_PING) {
			this.performance.update.avg = this.performance.update.sum / this.performance.update.counter;
			this.performance.update.sum = 0;
			this.performance.update.counter = 0;
			process.stdout.write("\r\x1b[K");
			process.stdout.write("Update: " + this.performance.update.avg.toFixed(2) + "ms");
		}
	} 
}

module.exports = Game;