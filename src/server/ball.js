const Constants = require('../shared/constants');


class Ball {
    constructor() {
        this.x = Constants.PITCH.FULL_X / 2,
            this.y = Constants.PITCH.FULL_Y / 2,
            this.Px = Constants.PITCH.FULL_X / 2
        this.Py = Constants.PITCH.FULL_Y / 2
        this.mass = Constants.BALL.MASS,
            this.radius = Constants.BALL.RADIUS,
            this.inertion = 0,
            this.resistance = 0.99;
        this.direction = 0;
        this.velosity = 0;
    }

    move(dt) {
        //Check if ball hits the border
        if (this.y + this.radius >= Constants.PITCH.Y + Constants.PITCH.PADDING_WIDTH + Constants.PITCH.OUTLINE_WIDTH) {
            this.direction = Math.PI - this.direction
        } else if (this.y - this.radius <= Constants.PITCH.PADDING_WIDTH + Constants.PITCH.OUTLINE_WIDTH) {
            this.direction = Math.PI - this.direction
        } else if (this.x + this.radius >= Constants.PITCH.X + Constants.PITCH.PADDING_WIDTH + Constants.PITCH.OUTLINE_WIDTH) {
            this.direction = Math.PI * 2 - this.direction
        } else if (this.x - this.radius <= Constants.PITCH.PADDING_WIDTH + Constants.PITCH.OUTLINE_WIDTH) {
            this.direction = Math.PI * 2 - this.direction
        }
        //then move
        this.x -= dt * this.velosity * Math.sin(this.direction);
        this.y -= dt * this.velosity * Math.cos(this.direction);
        this.velosity *= this.resistance;
    }
}

module.exports = Ball;