const {PLAYER, PITCH, GAME} = require("../shared/constants");

class Player {
	constructor (socket, nickname, x, y, team) {
		if (x <= PITCH.RIGHT_BORDER && x >= PITCH.LEFT_BORDER && y <= PITCH.BOTTOM_BORDER && y >= PITCH.TOP_BORDER) {
			this.x = x;
			this.y = y;
		} else
			this.setGoalkeeperPosition();
		
		this.nickname = nickname;
		this.socket = socket;
		/** True == 'Blue team' || False == 'Red team'*/
		this.team = team;
		/**Direction in Radians: 3.14 = PI */
		this.direction = 0;
		/**Mass affects collision with players and ball. The more mass - more your push power, more harder to push you*/
		this.mass = PLAYER.MASS;
		/** Speed in pixels/s*/
		this.speed = PLAYER.SPEED_DEFAULT;
		/**Rasius in pixels, currently doesnt affect anything */
		this.radius = PLAYER.RADIUS;

		/** `true` if user is holding ball */
		this.hold = false;
		/**Number: value of shot power or `0` if there is no shot */
		this.shot = 0;
		/**Boolean: `true` if [space] pressed and trying to pull the ball */
		this.pull = false;
		/**Boolean: `true` if [Lshift] pressed - player stops*/
		this.stop = false;
		/**Boolean: `true` if [RMB] pressed - player shoots ball but with small constant power */
		this.assist = false;
		/**Boolean: `true` if [W] pressed - player pushes ball in same direction as player */
		this.push = false;
		/**Boolean: `true` if [A] pressed - player rotates ball clockwise around player */
		this.rotateClockwise = false;
		/**Boolean: `true` if [D] pressed - player rotates ball counterclockwise around player */
		this.rotateCounterClockwise = false;
	}

	move(dt) {
		if (this.stop)
			return;
		
		const dy = dt * this.speed * Math.cos(this.direction);
		const dx = dt * this.speed * Math.sin(this.direction);

		//Check if will Player hits the border, if so, turn him around 
		if (this.y + this.radius + dy >= PITCH.BOTTOM_BORDER) {
			this.direction = Math.PI - this.direction;
		} else if (this.y - this.radius + dy <= PITCH.TOP_BORDER) {
			this.direction = Math.PI - this.direction;
		} else if (this.x + this.radius + dx >= PITCH.RIGHT_BORDER) {
			this.direction = Math.PI * 2 - this.direction;
		} else if (this.x - this.radius + dx <= PITCH.LEFT_BORDER) {
			this.direction = Math.PI * 2 - this.direction;
		}

		this.x += dt * this.speed * Math.sin(this.direction);
		this.y += dt * this.speed * Math.cos(this.direction);
	}

	setGoalkeeperPosition() {
		this.y = PITCH.Y / 2;
		if (this.team === GAME.LEFT_TEAM) {
			this.x = PITCH.LEFT_BORDER + PITCH.GOAL_WIDTH / 2;
		}
		else {
			this.x = PITCH.RIGHT_BORDER - PITCH.GOAL_WIDTH / 2;
		}
	}
	
	setMidfielderPosition() {
		this.y = PITCH.Y / 2;
		if (this.team === GAME.LEFT_TEAM) {
			this.x = PITCH.X / 4;
		} else {
			this.x = PITCH.X / 4 * 3;
		}
	}

	
	setForwardPosition() {
		this.y = PITCH.Y / 2;
		if (this.team === GAME.LEFT_TEAM) {
			this.x = PITCH.X / 2 - PITCH.CENTRAL_CIRCLE_RADIUS;
		}else {
			this.x = PITCH.X / 2 + PITCH.CENTRAL_CIRCLE_RADIUS;
		}
	}

}

module.exports = Player;