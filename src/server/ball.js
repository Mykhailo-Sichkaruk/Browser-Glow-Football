const Constants = require("../shared/constants");


class Ball {
	constructor() {
		this.x = Constants.PITCH.FULL_X / 2,
		this.y = Constants.PITCH.FULL_Y / 2,
		this.Px = Constants.PITCH.FULL_X / 2;
		this.Py = Constants.PITCH.FULL_Y / 2;
		this.mass = Constants.BALL.MASS,
		this.radius = Constants.BALL.RADIUS,
		this.inertion = 0,
		this.resistance = 0.99;
		this.direction = 0;
		this.velosity = 0;

		//Borders
		this.BORDER_BOTTOM = Constants.PITCH.Y + Constants.PITCH.PADDING_WIDTH + Constants.PITCH.OUTLINE_WIDTH;
		this.BORDER_TOP    = Constants.PITCH.PADDING_WIDTH + Constants.PITCH.OUTLINE_WIDTH;
		this.BORDER_RIGHT  = Constants.PITCH.X + Constants.PITCH.PADDING_WIDTH + Constants.PITCH.OUTLINE_WIDTH;
		this.BORDER_LEFT   = Constants.PITCH.PADDING_WIDTH + Constants.PITCH.OUTLINE_WIDTH;
	}

	move(dt) {
        
		const dy = - dt * this.velosity * Math.cos(this.direction);
		const dx = - dt * this.velosity * Math.sin(this.direction);

		//Check if ball hits the border then change direction
		if        (this.y + this.radius + dy >= this.BORDER_BOTTOM) {
			this.direction = Math.PI - this.direction;
		} else if (this.y - this.radius + dy <= this.BORDER_TOP) {
			this.direction = Math.PI - this.direction;
		} else if (this.x + this.radius + dx >= this.BORDER_RIGHT) {
			if ((this.y >= Constants.PITCH.FULL_Y / 2 - Constants.PITCH.GOAL_WIDTH / 2 ) && (this.y <= Constants.PITCH.FULL_Y / 2 + Constants.PITCH.GOAL_WIDTH / 2 ))
				return 1;
			else
				this.direction = Math.PI * 2 - this.direction;
		} else if (this.x - this.radius + dx <= this.BORDER_LEFT) {
			if ((this.y >= Constants.PITCH.FULL_Y / 2 - Constants.PITCH.GOAL_WIDTH / 2 ) && (this.y <= Constants.PITCH.FULL_Y / 2 + Constants.PITCH.GOAL_WIDTH / 2 ))
				return 2;
			else
				this.direction = Math.PI * 2 - this.direction;
		}
		//Then move
		this.x += - dt * this.velosity * Math.sin(this.direction);
		this.y += - dt * this.velosity * Math.cos(this.direction);
		//Apply resistance to velosity
		this.velosity *= this.resistance;
		return false; //False for Ball not touching the border or goal
	}
}

module.exports = Ball;