import { PLAYER, BALL, PITCH } from "../shared/constants.js";
const { PI, atan2, sin, cos, round, hypot } = Math;

class Collision {
	constructor() {
		// TODO document why this constructor is empty
	}
	/**
	 * Proceess every collision in the game by comparing every pair of entity
	 * @param {number} dt miliseconds since last update
	 */
	collision(dt) {
		let i = 0;

		for (const socket in this.players) {
			this.playerBallCollision(socket, dt);
			this.playerPlayerCollision(socket, i);
			i++;
		}
	}

	playerHoldBall(id) {
		if (!this.players[id].pull) {
			this.players[id].hold = false;
			this.players[id].speed = PLAYER.SPEED_DEFAULT;
			return;
		}

		this.players[id].hold = true;
		this.players[id].speed = PLAYER.SPEED_ON_HOLD;
		this.ball.x = this.players[id].x + PLAYER.RADIUS * sin(this.players[id].direction);
		this.ball.y = this.players[id].y + PLAYER.RADIUS * cos(this.players[id].direction);
		this.ball.direction = this.players[id].direction;
		this.ball.speed = this.players[id].speed;
		this.ball.resistance = PITCH.RESISTANCE_DEFAULT;
	}

	/**
	 * Change ball direction and speed when player touches ball
	 * @param {number} id player's id
	 */
	playerTouchBall(id) {
		const PowerVector = atan2(this.ball.x - this.players[id].x, this.ball.y - this.players[id].y);
		this.ball.direction = PowerVector;
		this.ball.speed = (((this.players[id].mass - this.ball.mass) *  this.players[id].speed +  2 * this.ball.mass) /  (this.players[id].mass + this.ball.mass)) * 2;
		this.ball.resistance = PITCH.RESISTANCE_DEFAULT;
	}

	playerPullBall(id) {
		const currentDistance = (this.ball.y - this.players[id].y) ** 2 + (this.ball.x - this.players[id].x) ** 2;

		if (this.players[ id ].pull) {
			if (currentDistance <= PLAYER.HOLD_BALL_DISTANCE) {
				this.playerHoldBall(id);
			} else if (currentDistance <= PLAYER.PULL_DISTANCE_POWER) {
				const ballToPlayerDirection = atan2(this.players[id].x - this.ball.x, this.players[id].y - this.ball.y);
				this.ball.y += PLAYER.PULL_FORCE * cos(ballToPlayerDirection);
				this.ball.x += PLAYER.PULL_FORCE * sin(ballToPlayerDirection);
				this.players[ id ].shot = 0;
				this.players[ id ].hold = 0;
				this.ball.resistance = PITCH.RESISTANCE_DEFAULT;
			}
		}
	}

	playerRotateClockwiseBall(id, dt) {
		this.ball.speed += BALL.BONUS_SPEED_ON_ROTATE;
		const { vector, angle } = this.getRotationAngle(id, dt);
		this.ball.direction = vector - angle;
		this.ball.resistance = PITCH.RESISTANCE_DEFAULT;
	}

	playerRotateCounterClockwiseBall(id, dt) {
		this.ball.speed += BALL.BONUS_SPEED_ON_ROTATE;
		const { vector, angle } = this.getRotationAngle(id, dt);
		this.ball.direction = vector + angle;
		this.ball.resistance = PITCH.RESISTANCE_DEFAULT;
	}

	getRotationAngle(id, dt) {
		const vector = atan2(round(this.players[ id ].x - this.ball.x), round(this.players[ id ].y - this.ball.y));
		const ds = this.ball.speed * dt;
		const dx = round(this.players[ id ].x - this.ball.x);
		const dy = round(this.players[ id ].y - this.ball.y);
		const radius = hypot(dx, dy);
		const N = (2 * PI * radius) / ds;
		const angle = (PI / 2) - (PI / N);
		return { vector, angle };
	}

	playerPushBall(id) {
		this.ball.direction = this.players[ id ].direction;
		this.ball.speed = this.players[ id ].speed;
		this.ball.resistance = PITCH.RESISTANCE_DEFAULT;
	}

	/**
	 * Shot ball with player's direction and shot power that was set by player in the ***catch perfect timing game***
	 * @param {number} id
	 */
	playerKickBall(id) {
		if (this.players[ id ].hold) {
			this.ball.x = this.players[ id ].x + (PLAYER.RADIUS + BALL.RADIUS + 2) * sin(this.players[ id ].direction);
			this.ball.y = this.players[ id ].y + (PLAYER.RADIUS + BALL.RADIUS + 2) * cos(this.players[ id ].direction);
			this.ball.direction = this.players[ id ].direction;
			this.ball.speed = PLAYER.KICK_FORCE * this.players[ id ].shot;

			this.players[ id ].shot = 0;
			this.players[ id ].pull = false;
			this.players[ id ].push = false;
			this.players[ id ].hold = false;
			this.players[ id ].speed = PLAYER.SPEED_DEFAULT;
		} else {
			this.players[ id ].shot = 0;
			this.players[ id ].hold = 0;
		}
	}

	/**
	 * Assist ball with constant speed and current player's direction
	 * @param {number} id
	 */
	playerAssistBall(id) {
		if (this.players[ id ].hold) {
			this.ball.x = this.players[ id ].x + (PLAYER.RADIUS + this.ball.radius + 2) * sin(this.players[ id ].direction);
			this.ball.y = this.players[ id ].y + (PLAYER.RADIUS + this.ball.radius + 2) * cos(this.players[ id ].direction);
			this.ball.direction = this.players[ id ].direction;
			this.ball.speed = PLAYER.ASSIST_FORCE;
			this.ball.resistance = PITCH.RESISTANCE_ON_ASSIST;

			this.players[ id ].pull = false;
			this.players[ id ].assist = false;
			this.players[ id ].hold = false;
			this.players[ id ].speed = PLAYER.SPEED_DEFAULT;
		}
	}

	/**
	 * Provides collisions betweeen ball and player
	 * @param {number} id - player key in this.players object
	 * @param {number} dt - time delta
	 * @returns
	 */
	playerBallCollision(id, dt) {
		const ballDs = this.ball.speed * dt;
		const ballY = this.ball.x + ballDs * cos(this.ball.direction);
		const ballX = this.ball.y + ballDs * sin(this.ball.direction);

		const playerDs = this.players[id].speed * dt;
		const playerY = this.players[id].x + playerDs * cos(this.players[id].direction);
		const playerX = this.players[id].y + playerDs * sin(this.players[id].direction);

		const currentDistance = (ballY - playerY) ** 2 + (ballX - playerX) ** 2;

		if (this.players[id].hold) {
			if (this.players[id].shot) {
				this.playerKickBall(id);
			} else if (this.players[ id ].assist) {
				this.playerAssistBall(id);
			} else {
				this.playerHoldBall(id);
			}
			return;
		}

		if (currentDistance <= PLAYER.BALL_COLLISION_DISTANCE) {
			this.playerTouchBall(id);
			return;
		}

		if (currentDistance <= PLAYER.PULL_DISTANCE_POWER) {
			if (this.players[id].pull) {
				this.playerPullBall(id);
			} else if (this.players[id].rotateClockwise) {
				this.playerRotateClockwiseBall(id, dt);
			} else if (this.players[id].rotateCounterClockwise) {
				this.playerRotateCounterClockwiseBall(id, dt);
			} else if (this.players[id].push) {
				this.playerPushBall(id);
			}
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
}

export default Collision;
