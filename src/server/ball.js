import { BALL, PITCH } from "../shared/constants.js";
const { PI, sin, cos, round } = Math;

class Ball {
	constructor() {
		this.x = PITCH.FULL_X / 2;
		this.y = PITCH.FULL_Y / 2;
		this.mass = BALL.MASS;
		this.radius = BALL.RADIUS;
		this.resistance = PITCH.RESISTANCE_DEFAULT;
		this.speed = 0;
		this.direction = 0;
		this.setInCenter();
	}

	/**
	 * Move ball and return goal status
	 * @param {*} dt - miliseconds since last update
	 * @returns `undefined` if **no** goal was hit, `true` for blue team scored, `false` for red team scored
	 */
	move(dt) {
		const ds = dt * this.speed;
		const dy = ds * cos(this.direction);
		const dx = ds * sin(this.direction);

		const result = this.isGoal(dx);

		if (result === undefined) {
			if (this.hitBottom(dy) || this.hitTop(dy)) {
				this.direction = PI - this.direction;
			} else if (this.hitRight(dx) || this.hitLeft(dx)) {
				this.direction = PI * 2 - this.direction;
			}
			//Then move
			this.x += ds * sin(this.direction);
			this.y += ds * cos(this.direction);
			//Apply resistance to velosity
			this.speed *= this.resistance;

			return undefined;
		}

		return result;
	}

	/**
	 * Check if ball will hit the goal
	 * @param {*} dx - distance to move in x direction
	 * @returns `undefined` if **no** goal was hit, `true` for blue team scored, `false` for red team scored
	 */
	isGoal(dx) {
		if ((this.y >= PITCH.FULL_Y / 2 - PITCH.GOAL_WIDTH / 2) && (this.y <= PITCH.FULL_Y / 2 + PITCH.GOAL_WIDTH / 2)) {
			if (this.hitRight(dx)) {
				return true;
			} else if (this.hitLeft(dx)) {
				return false;
			}
		}
	}

	setInCenter() {
		this.x = PITCH.FULL_X / 2;
		this.y = PITCH.FULL_Y / 2;
		this.speed = 0;
		this.direction = 0;
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

	getState() {
		return {
			x: round(this.x),
			y: round(this.y),
		};
	}
}

export default Ball;
