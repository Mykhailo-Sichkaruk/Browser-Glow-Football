const Constants = require('../shared/constants');

class Player {
    constructor(socket, nickname, x, y, team) {
        this.socket = socket;
        this.nickname = nickname;
        this.team = team;
        this.x = x;
        this.y = y;
        this.Px = x;
        this.Py = y;
        this.direction = Math.PI / 2;
        this.mass = Constants.PLAYER.MASS;
        this.velosity = Constants.PLAYER.SPEED;
        this.radius = Constants.PLAYER.RADIUS;
        this.hp = Constants.PLAYER.MAX_HP;
        this.state = true;

        this.fireCooldown = 0;
        this.score = 0;
    }

    move(dt) {
        this.BorderHit();
        this.x -= dt * this.velosity * Math.sin(this.direction);
        this.y -= dt * this.velosity * Math.cos(this.direction);
    }

    BorderHit() {
        if (this.y + this.radius >= Constants.PITCH.Y + Constants.PITCH.PADDING_WIDTH + Constants.PITCH.OUTLINE_WIDTH) {
            this.direction = Math.PI - this.direction
        } else if (this.y - this.radius <= Constants.PITCH.PADDING_WIDTH + Constants.PITCH.OUTLINE_WIDTH) {
            this.direction = Math.PI - this.direction
        } else if (this.x + this.radius >= Constants.PITCH.X + Constants.PITCH.PADDING_WIDTH + Constants.PITCH.OUTLINE_WIDTH) {
            this.direction = Math.PI * 2 - this.direction
        } else if (this.x - this.radius <= Constants.PITCH.PADDING_WIDTH + Constants.PITCH.OUTLINE_WIDTH) {
            this.direction = Math.PI * 2 - this.direction
        }
    }
}

module.exports = Player;