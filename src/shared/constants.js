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
	},

	GAME: {
		AFTER_GOAL_DELAY_MS: 5000, //ms
	},

	MSG_TYPES: {
		JOIN_GAME: "join_game",
		GAME_UPDATE: "update",
		INPUT: "input",
		MOUSE_INPUT: "mouse",
		LMB_CLICK: "lmb_click",
		RMB_CLICK: "rmb_click",
		KEY_SPACE: "key_space",
		KEY_SHIFT: "key_shift",
		KEY_W: "key_w",
		KEY_A: "key_a",
		KEY_D: "key_d",
		GAME_OVER: "dead",
		PING: "ping",
		DISCONNECT: "disconnect",
		GOAL: "goal",
	},
});