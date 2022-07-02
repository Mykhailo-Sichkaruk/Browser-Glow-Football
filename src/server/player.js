import { PLAYER, PITCH } from "../shared/constants.js";

/**
 * Describe Player states and behavior.
 */
class Player {
	/**
	 *
	 * @param {*} socket
	 * @param {string} nickname
	 * @param {boolean} team - true Blue team false Red team
	 * @param {number} teamPosition - 1 - goalkeeper, 2 - midfielder, 3 - forward
 	 * @param {string} room - room id
	 */
	constructor(socket, nickname, team, teamPosition, room) {
		/** Socket.io room/game indentificator */
		this.room = room;
		/** Socket of current player */
		this.socket = socket;
		/** Nick */
		this.nickname = nickname;
		/** True == 'Blue team' || False == 'Red team'*/
		this.team = team;
		/**Direction in Radians: 3.14 = PI */
		this.teamPosition = teamPosition;
		this.setStartPosition();

		this.direction = Math.PI * 2;
		/**Mass affects collision with players and ball.
		 * The more mass - more your push power, more harder to push you*/
		this.mass = PLAYER.MASS;
		/** Speed in pixels/s*/
		this.speed = PLAYER.SPEED_DEFAULT;
		/**Rasius in pixels, currently doesnt affect anything */
		this.radius = PLAYER.RADIUS;

		/**Boolean: `true` if user is holding ball */
		this.hold = false;
		/**Number: value of shot power or `0` if there is no shot */
		this.shot = 0;
		/**Boolean: `true` if [space] pressed and trying to pull the ball */
		this.pull = false;
		/**Boolean: `true` if [Lshift] pressed - player stops*/
		this.stop = false;
		/**Boolean: `true` if [RMB] pressed -
		 * player shoots ball but with small constant power */
		this.assist = false;
		/**Boolean: `true` if [W] pressed -
		 * player pushes ball in same direction as player */
		this.push = false;
		/**Boolean: `true` if [A] pressed -
		 * player rotates ball clockwise around player */
		this.rotateClockwise = false;
		/**Boolean: `true` if [D] pressed -
		 * player rotates ball counterclockwise around player */
		this.rotateCounterClockwise = false;
	}

	move(dt) {
		if (this.stop)
			return;

		const shift = dt * this.speed;
		const dy = shift * Math.cos(this.direction);
		const dx = shift * Math.sin(this.direction);

		//Check if will Player hits the border, if so, turn him around
		if (this.hitTopBorder(dy) || this.hitBottomBorder(dy))
			this.direction = Math.PI - this.direction;
		else if (this.hitLeftBorder(dx) || this.hitRightBorder(dx))
			this.direction = Math.PI * 2 - this.direction;

		this.x += shift * Math.sin(this.direction);
		this.y += shift * Math.cos(this.direction);
	}

	/**
	 * Set player to goalkeeper position, near goal
	 */
	setGoalkeeperPosition() {
		this.y = PITCH.FULL_Y / 2;
		if (this.team) {
			this.x = PITCH.BLUE_GOALKEEPER_POSITION_X;
		} else {
			this.x = PITCH.RED_GOALKEEPER_POSITION_X;
		}
	}

	/**
	 * Set player to midfield position, near center of own side
	 */
	setMidfielderPosition() {
		this.y = PITCH.FULL_Y / 2;
		if (this.team) {
			this.x = PITCH.BLUE_MIDFIELDER_POSITION_X;
		} else {
			this.x = PITCH.RED_MIDFIELDER_POSITION_X;
		}
	}

	/**
	 * Set player to attacker position, near senter of the pitch
	 */
	setForwardPosition() {
		this.y = PITCH.FULL_Y / 2;
		if (this.team) {
			this.x = PITCH.BLUE_FORWARD_POSITION_X;
		} else {
			this.x = PITCH.RED_FORWARD_POSITION_X;
		}
	}

	isInsidePitch(x, y) {
		return (
			x >= PITCH.LEFT_BORDER &&
			x <= PITCH.RIGHT_BORDER &&
			y >= PITCH.TOP_BORDER &&
			y <= PITCH.BOTTOM_BORDER
		);
	}

	hitTopBorder(dy) {
		return this.y - this.radius + dy <= PITCH.TOP_BORDER;
	}

	hitBottomBorder(dy) {
		return this.y + this.radius + dy >= PITCH.BOTTOM_BORDER;
	}

	hitLeftBorder(dx) {
		return this.x - this.radius + dx <= PITCH.LEFT_BORDER;
	}

	hitRightBorder(dx) {
		return this.x + this.radius + dx >= PITCH.RIGHT_BORDER;
	}

	setStartPosition() {
		this.setDefaultState();
		switch (this.teamPosition) {
		case 2:
			this.setMidfielderPosition();
			break;
		case 3:
			this.setForwardPosition();
			break;
		default:
			this.setGoalkeeperPosition();
			break;
		}
	}

	setDefaultState() {
		this.push = false;
		this.rotateClockwise = false;
		this.rotateCounterClockwise = false;
		this.pull = false;
		this.stop = false;
		this.assist = false;
		this.hold = false;
		this.shot = 0;
		this.speed = PLAYER.SPEED_DEFAULT;
	}

	getState() {
		return {
			x: Math.floor(this.x),
			y: Math.floor(this.y),
			team: this.team,
		};
	}
}

export default Player;
