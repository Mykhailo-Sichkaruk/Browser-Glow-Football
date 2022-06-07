const Constants = require("../shared/constants");

class Player {
	constructor(socket, nickname, x, y, team) {
		this.socket = socket;
		this.nickname = nickname;
		this.team = team; //True == 'Blue team' || False == 'Red team'
		this.x = x;
		this.y = y;
		this.direction = Math.PI / 2;
		this.mass = Constants.PLAYER.MASS;
		this.velosity = Constants.PLAYER.SPEED;
		this.radius = Constants.PLAYER.RADIUS;

		//Super Powers
		this.shot = 0;
		this.pull = false;
		this.stop = false;
		this.assist = false;

		this.push = false;
		this.rotateClockwise = false;
		this.rotateCounterClockwise = false;
		
		this.score = 0; //Add players score
	}

	move(dt) {
		if (this.stop)
			return;
		
		const dy = - dt * this.velosity * Math.cos(this.direction);
		const dx = - dt * this.velosity * Math.sin(this.direction);

		//Check if Player hits the border
		if (this.y + this.radius + dy >= Constants.PITCH.Y + Constants.PITCH.PADDING_WIDTH + Constants.PITCH.OUTLINE_WIDTH) {
			this.direction = Math.PI - this.direction;
		} else if (this.y - this.radius + dy <= Constants.PITCH.PADDING_WIDTH + Constants.PITCH.OUTLINE_WIDTH) {
			this.direction = Math.PI - this.direction;
		} else if (this.x + this.radius + dx >= Constants.PITCH.X + Constants.PITCH.PADDING_WIDTH + Constants.PITCH.OUTLINE_WIDTH) {
			this.direction = Math.PI * 2 - this.direction;
		} else if (this.x - this.radius + dx <= Constants.PITCH.PADDING_WIDTH + Constants.PITCH.OUTLINE_WIDTH) {
			this.direction = Math.PI * 2 - this.direction;
		}
		this.x += - dt * this.velosity * Math.sin(this.direction);
		this.y += - dt * this.velosity * Math.cos(this.direction);
	}
}

module.exports = Player;