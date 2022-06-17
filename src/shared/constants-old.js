module.exports = Object.freeze({
	GAME: {
		AFTER_GOAL_DELAY_MS: 5000, //ms
		PING_ON_KEY_STATUS_REFRESHED_MS: 50,
		SERVER_PING: 20,
	},
	PLAYER: {
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
		RED_COLOR: "red",
		BLUE_COLOR: "blue"
	},
	PITCH: {
		X: 1540,
		Y: 840,
		FULL_X: 1600,
		FULL_Y: 900,
		RADIUS: 50,
		PADDING_WIDTH: 10,
		OUTLINE_WIDTH: 20,
		GOAL_WIDTH: 100, //WIDTH
		COLOR: "rgb(0, 255, 64)",
		CANVAS_BACKGROUND_COLOR: "rgb(255, 187, 0)",
		OUTLINE_COLOR: "white",
		CENTRAL_CIRCLE_RADIUS: 160,
		BORDER_LEFT_X: 0,
		RESISTANCE: 0.99,
	},
	BALL: {
		MASS: 1,
		RADIUS: 7,
		COLOR: "white",
		BOUNS_BALL_VELOSITY_ON_ROTATE: 10,
	},
	MESSAGE: {
		CONNECTION: "connection",
		JOIN_GAME: "join_game",
		GAME_UPDATE: "update",
		GOAL: "goal",
		INPUT: "input",
		DISCONNECT: "disconnect",
	},
	INPUT_TYPE: {
		KEY: "key",
		DIRECTION: "direction",
		SHOT: "shot",
		ASSIST: "assist",
	},
	KEY_TYPE: {
		PULL: "pull",
		STOP: "stop",
		PUSH: "push",
		ROTATE_CLOCKWISE: "rotateClockwise",
		ROTATE_COUNTER_CLOCKWISE: "rotateCounterClockwise",
	},
	DEVELOP: {
		SERVER_PORT: 3000,
		SERVER_ADRESS_IPv4: "localhost",
		SITE_FOLDER_NAME: "dist",
	},

});