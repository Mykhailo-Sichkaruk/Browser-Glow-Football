const { PITCH, BALL, } = require("../shared/constants");

class Ball {
	constructor() {
		this.x = PITCH.FULL_X / 2,
		this.y = PITCH.FULL_Y / 2,
		this.mass = 		BALL.MASS,
		this.radius = 		BALL.RADIUS,
		this.resistance = 	PITCH.RESISTANCE;
		this.direction = 0;
		this.speed = 0;
	}

	move(dt) {

		const shift = dt * this.speed;
		const dy = shift * Math.cos(this.direction);
		const dx = shift * Math.sin(this.direction);

		//Check if ball hits the border then change direction
		if (this.hitBottom(dy) || this.hitTop(dy)) {
			this.direction = Math.PI - this.direction;
		} else if (this.hitRight(dx)) {
			if (this.isInGoal())
				return 1;
			else
				this.direction = Math.PI * 2 - this.direction;
		} else if (this.hitLeft(dx)) {
			if (this.isInGoal())
				return 2;
			else
				this.direction = Math.PI * 2 - this.direction;
		}
		//Then move
		this.x += shift * Math.sin(this.direction);
		this.y += shift * Math.cos(this.direction);
		//Apply resistance to velosity
		this.speed *= this.resistance;
		return 0; //False for Ball not touching the border or goal
	}

	isInGoal() {
		if ((this.y >= PITCH.FULL_Y / 2 - PITCH.GOAL_WIDTH / 2) && (this.y <= PITCH.FULL_Y / 2 + PITCH.GOAL_WIDTH / 2))
			return true;
	}

	hitBottom(dy) {
		if (this.y + this.radius + dy >= PITCH.BOTTOM_BORDER)
			return true;
	}

	hitTop(dy) {
		if (this.y - this.radius + dy <= PITCH.TOP_BORDER)
			return true;
	}

	hitRight(dx) {
		if (this.x + this.radius + dx >= PITCH.RIGHT_BORDER)
			return true;
	}

	hitLeft(dx) {
		if (this.x - this.radius + dx <= PITCH.LEFT_BORDER)
			return true;
	}

}

module.exports = Ball;
