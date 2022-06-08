module.exports = Object.freeze({
	SERVER_PING: 20,

	PLAYER: {
		RADIUS: 15,
		MASS: 5,
		SPEED: 250,
		NITRO_VELOSITY: 150, //push veloity
		PULL_SPEED: 75,
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
	},

	BALL: {
		MASS: 1,
		RADIUS: 7,
		COLOR: "white",
	},

	PHYSICS: {
		SHOT_SPEED: 1700,
		ASSIST_SPEED: 800,
		/*** Distance between Player and Ball where pull power works*/
		DISTANCE_PLAYER_PULL_POWER: 75 ** 2,
		PLAYER_PULL_POWER: 6,
		BOUNS_BALL_VELOSITY_ON_ROTATE: 10,
		PITCH_RESISTANCE: 0.99,
	},

	GAME: {
		AFTER_GOAL_DELAY_MS: 5000, //ms
		PING_ON_KEY_STATUS_REFRESHED_MS: 50,
	},

	MSG_TYPE: {
		CONNECTION: "connection",
		JOIN_GAME: "join_game",
		GAME_UPDATE: "update",
		GAME_OVER: "game over",
		PING: "ping",
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

});