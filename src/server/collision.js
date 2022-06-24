import  { PLAYER, BALL } from "../shared/constants.js";

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
			this.playerPlayerCollision(socket, i);

			i++;
		}
	}

	playerHoldBall(id) {
		this.players[id].hold = true;
		this.players[id].speed = PLAYER.SPEED_ON_HOLD;
		this.ball.x = this.players[id].x + PLAYER.RADIUS * Math.sin(this.players[id].direction);
		this.ball.y = this.players[id].y + PLAYER.RADIUS * Math.cos(this.players[id].direction);
		this.ball.direction = this.players[id].direction;
		this.ball.speed = this.players[id].speed;
	}

	/**
	 * Change ball direction and speed when player touches ball
	 * @param {number} id
	 */
	playerTouchBall(id) {
		const PowerVector = Math.atan2(this.ball.x - this.players[id].x, this.ball.y - this.players[id].y);
		this.ball.direction = PowerVector;
		this.ball.speed = (((this.players[id].mass - this.ball.mass) *  this.players[id].speed +  2 * this.ball.mass) /  (this.players[id].mass + this.ball.mass)) * 2;
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
		const currentDistance = (this.ball.y - this.players[id].y) ** 2 + (this.ball.x - this.players[id].x) ** 2;

		if (this.players[id].pull) {
			if (currentDistance <= PLAYER.PULL_DISTANCE_POWER) {
				const ballToPlayerDirection = Math.atan2(this.players[id].x - this.ball.x, this.players[id].y - this.ball.y);
				this.ball.direction = (ballToPlayerDirection + this.ball.direction) / 2;
				this.ball.velosity += BALL.BONUS_SPEED_ON_ROTATE;
			} else if (currentDistance <= PLAYER.PULL_DISTANCE_POWER * 4) {
				this.ball.y -= Math.sign(this.ball.y - this.players[id].y) * (PLAYER.PULL_FORCE / 2);
				this.ball.x -= Math.sign(this.ball.x - this.players[id].x) * (PLAYER.PULL_FORCE / 2);
			}
			return;
		}
		if (this.players[id].rotateClockwise && currentDistance <= PLAYER.PULL_DISTANCE_POWER) {
			this.ball.direction = Math.atan2(this.players[id].x - this.ball.x, this.players[id].y - this.ball.y) - Math.PI / 2;
			this.ball.speed += BALL.BONUS_SPEED_ON_ROTATE;
			return;
		}
		if (this.players[id].rotateCounterClockwise && currentDistance <= PLAYER.PULL_DISTANCE_POWER) {
			this.ball.direction = Math.atan2(this.players[id].x - this.ball.x, this.players[id].y - this.ball.y) + Math.PI / 2;
			this.ball.speed += BALL.BONUS_SPEED_ON_ROTATE;
			return;
		}
		if (this.players[id].push && currentDistance <= PLAYER.PULL_DISTANCE_POWER) {
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
	playerAssistBall(id) {
		if (this.players[ id ].hold) {
			this.ball.x = this.players[ id ].x + (PLAYER.RADIUS + this.ball.radius + 2) * Math.sin(this.players[ id ].direction);
			this.ball.y = this.players[ id ].y + (PLAYER.RADIUS + this.ball.radius + 2) * Math.cos(this.players[ id ].direction);
			this.ball.direction = this.players[ id ].direction;
			this.ball.speed = PLAYER.ASSIST_FORCE;

			this.players[ id ].shot = 0;
			this.players[ id ].pull = false;
			this.players[ id ].push = false;
			this.players[ id ].assist = false;
			this.players[ id ].hold = false;

		}
	}

	/**
	 * Defines collisions type betweeen ball and player
	 * @param {number} id - player key in this.players object
	 * @param {number} dt - time delta
	 * @returns
	 * - 0 - no collision
	 * - 1 - player collides with ball
	 * - 2 - player hold ball
	 * - 3 - player hold ball and kick it
	 * - 4 - player hold ball and assist it
	 * - 5 - player use force actions
	 */
	isBallTouch(id, dt) {
		const ballDs = this.ball.speed * dt;
		const ballY = this.ball.x + ballDs * Math.cos(this.ball.direction);
		const ballX = this.ball.y + ballDs * Math.sin(this.ball.direction);

		const playerDs = this.players[id].speed * dt;
		const playerY = this.players[id].x + playerDs * Math.cos(this.players[id].direction);
		const playerX = this.players[id].y + playerDs * Math.sin(this.players[id].direction);

		const currentDistance = (ballY - playerY) ** 2 + (ballX - playerX) ** 2;

		if (currentDistance <= PLAYER.BALL_COLLISION_DISTANCE) {
			if (this.players[id].pull) {
				if (this.players[id].shot !== 0) {
					return 3;
				} else if (this.players[id].assist === true) { // Player Hold the ball and shots it in same time
					return 4;
				} else { // Player assist the ball
					return 2;
				} // Player holds the ball
			} else {
				return 1;
			} // Just collision
		} else if (currentDistance <= PLAYER.HOLD_BALL_DISTANCE && this.players[id].pull) {
			return 2;
		} else if (this.players[id].pull || this.players[id].push || this.players[id].rotateClockwise || this.players[id].rotateCounterClockwise) {
			return 5;
		} else {  // Player force actions
			return 0;
		} // No collision or action
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
