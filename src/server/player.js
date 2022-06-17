const {PLAYER, PITCH} = require("../shared/constants");

class Player {
	constructor(socket, nickname, x, y, team) {
		this.socket = socket;
		this.nickname = nickname;
		this.x = x;
		this.y = y;
		/** True == 'Blue team' || False == 'Red team'*/
		this.team = team;
		/**Direction in Radians: 3.14 = PI */
		this.direction = 0;
		/**Mass affects collision with players and ball. The more mass - more your push power, more harder to push you*/
		this.mass = PLAYER.MASS;
		/** Speed in pixels/s*/
		this.speed = PLAYER.SPEED_DEFAULT;
		/**Rasius in pixels, currently dont affects anything */
		this.radius = PLAYER.RADIUS;

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
		
		const dy = + dt * this.speed * Math.cos(this.direction);
		const dx = + dt * this.speed * Math.sin(this.direction);

		//Check if will Player hits the border, if so, turn him around 
		if 		  (this.y + this.radius + dy >=  PITCH.BOTTOM_BORDER) {
			this.direction = Math.PI - this.direction;
		} else if (this.y - this.radius + dy <=  PITCH.TOP_BORDER) {
			this.direction = Math.PI - this.direction;
		} else if (this.x + this.radius + dx >=  PITCH.RIGHT_BORDER) {
			this.direction = Math.PI * 2 - this.direction;
		} else if (this.x - this.radius + dx <=  PITCH.LEFT_BORDER) {
			this.direction = Math.PI * 2 - this.direction;
		}

		this.x += dt * this.speed * Math.sin(this.direction);
		this.y += dt * this.speed * Math.cos(this.direction);
	}
}

module.exports = Player;