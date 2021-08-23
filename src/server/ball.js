const Constants = require('../shared/constants');


class Ball{
    constructor(){
        this.x = Constants.MAP_SIZE/2,
        this.y = Constants.MAP_SIZE/2,
        this.Px = Constants.MAP_SIZE/2,
        this.Py = Constants.MAP_SIZE/2,
        this.mass = Constants.BALL.MASS,
        this.radius = Constants.BALL.RADIUS,
        this.inertion = 0;
        this.direction = {
            x: 0,
            y: 0,
        };
    }

    move(dx, dy){
        this.Px = this.x;
        this.Py = this.y;
        this.x += dx;
        this.y += dy;
    }
}

module.exports = Ball;
