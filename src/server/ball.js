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

		const dy = dt * this.speed * Math.cos(this.direction);
		const dx = dt * this.speed * Math.sin(this.direction);

		//Check if ball hits the border then change direction
		if        (this.y + this.radius + dy >= PITCH.BOTTOM_BORDER) {
			this.direction = Math.PI - this.direction;
		} else if (this.y - this.radius + dy <= PITCH.TOP_BORDER) {
			this.direction = Math.PI - this.direction;
		} else if (this.x + this.radius + dx >= PITCH.RIGHT_BORDER) {
			if (this.isInGoal())
				return 1;
			else
				this.direction = Math.PI * 2 - this.direction;
		} else if (this.x - this.radius + dx <= PITCH.LEFT_BORDER) {
			if (this.isInGoal())
				return 2;
			else
				this.direction = Math.PI * 2 - this.direction;
		}
		//Then move
		this.x += dt * this.speed * Math.sin(this.direction);
		this.y += dt * this.speed * Math.cos(this.direction);
		//Apply resistance to velosity
		this.speed *= this.resistance;
		return 0; //False for Ball not touching the border or goal
	}

	isInGoal() {
		if ((this.y >= PITCH.FULL_Y / 2 - PITCH.GOAL_WIDTH / 2) && (this.y <= PITCH.FULL_Y / 2 + PITCH.GOAL_WIDTH / 2))
			return true;
	}
}

module.exports = Ball;
