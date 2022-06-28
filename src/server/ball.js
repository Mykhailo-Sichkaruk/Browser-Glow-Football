import  { BALL, PITCH } from "../shared/constants.js";

class Ball {
	constructor() {
		this.mass = BALL.MASS;
		this.radius = BALL.RADIUS;
		this.resistance = PITCH.RESISTANCE;
		this.setInCenter();
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

	setInCenter() {
		this.x = PITCH.FULL_X / 2;
		this.y = PITCH.FULL_Y / 2;
		this.speed = 0;
		this.direction = 0;
	}

	isInGoal() {
		if ((this.y >= PITCH.FULL_Y / 2 - PITCH.GOAL_WIDTH / 2) && (this.y <= PITCH.FULL_Y / 2 + PITCH.GOAL_WIDTH / 2))
			return true;
	}

	hitBottom(dy) {
		return (this.y + this.radius + dy >= PITCH.BOTTOM_BORDER);
	}

	hitTop(dy) {
		return (this.y - this.radius + dy <= PITCH.TOP_BORDER);
	}

	hitRight(dx) {
		return (this.x + this.radius + dx >= PITCH.RIGHT_BORDER);
	}

	hitLeft(dx) {
		return (this.x - this.radius + dx <= PITCH.LEFT_BORDER);
	}

}

export default Ball;
