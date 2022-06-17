const GAME = {
	LEFT_TEAM: "left",
	RIGHT_TEAM: "right",
	AFTER_GOAL_DELAY_MS: 1000, //ms
	PING_ON_KEY_STATUS_REFRESHED_MS: 50,
	SERVER_PING: 20,
	SHOT_ANIMATION_TIME: 500, //ms
	SHOT_POWER_PANE_DELAY: 1000, //ms
	MOUSE_UPDATE_DELAY: 100, //ms
};
const PLAYER= {
	RADIUS: 15,
	MASS: 5,
	SPEED_DEFAULT: 250,
	SPEED_ON_FORCE_ACTION: 150,
	SPEED_ON_HOLD: 75,
	PULL_FORCE: 6,
	SHOT_FORCE: 1700,
	ASSIST_FORCE: 800,
	/*** Distance between Player and Ball where pull power works*/
	DISTANCE_PLAYER_PULL_POWER: 75 ** 2,
	get PLAYER_PLAYER_COLLISION_DISTANCE() 	{ return (this.RADIUS * 2) ** 2; },
	get PLAYER_BALL_COLLISION_DISTANCE() 	{ return (this.RADIUS + BALL.RADIUS) ** 2; },
	get PLAYER_BALL_HOLD_DISTANCE() 		{ return this.PLAYER_BALL_COLLISION_DISTANCE * 4; },
	RED_COLOR: "red",
	BLUE_COLOR: "blue"
};
const PITCH= {
	X: 1540,
	Y: 840,
	FULL_X: 1600,
	FULL_Y: 900,
	RADIUS: 50,
	PADDING_WIDTH: 10,
	OUTLINE_WIDTH: 20,
	get TOP_BORDER()	{ return this.PADDING_WIDTH + this.OUTLINE_WIDTH; },
	get BOTTOM_BORDER() { return this.PADDING_WIDTH + this.OUTLINE_WIDTH + this.Y; },
	get RIGHT_BORDER()	{ return this.PADDING_WIDTH + this.OUTLINE_WIDTH + this.X; },
	get LEFT_BORDER()	{ return this.PADDING_WIDTH + this.OUTLINE_WIDTH; },
	GOAL_WIDTH: 100, //WIDTH
	COLOR: "rgb(0, 255, 64)",
	CANVAS_BACKGROUND_COLOR: "rgb(255, 187, 0)",
	OUTLINE_COLOR: "white",
	CENTRAL_CIRCLE_RADIUS: 160,
	BORDER_LEFT_X: 0,
	RESISTANCE: 0.99,
};
const BALL= {
	MASS: 1,
	RADIUS: 7,
	BONUS_SPEED_ON_ROTATE: 10,
	COLOR: "white",
};
const MESSAGE= {
	CONNECTION: "connection",
	JOIN_GAME: "join_game",
	GAME_UPDATE: "update",
	GOAL: "goal",
	INPUT: "input",
	DISCONNECT: "disconnect",
};
const INPUT_TYPE= {
	KEY: "key",
	DIRECTION: "direction",
	SHOT: "shot",
	ASSIST: "assist",
};
const KEY_TYPE= {
	PULL: "pull",
	STOP: "stop",
	PUSH: "push",
	ROTATE_CLOCKWISE: "rotateClockwise",
	ROTATE_COUNTER_CLOCKWISE: "rotateCounterClockwise",
};
const DEVELOP= {
	SERVER_PORT: 3000,
	SERVER_ADRESS_IPv4: "localhost",
	SITE_FOLDER_NAME: "dist",
};

module.exports = {
	GAME,
	PLAYER,
	PITCH,
	BALL,
	MESSAGE,
	INPUT_TYPE,
	KEY_TYPE,
	DEVELOP,
};
