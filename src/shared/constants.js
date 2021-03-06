// eslint-disable-next-line strict
"use strict";
const GAME = Object.freeze({
	/** @type {number}  `miliseconds` Delay between server calculations of new game status */
	SERVER_PING: 33,
	/** @type {number} `miliseconds` Delay between sending info about key`s status */
	PING_ON_KEY_STATUS_REFRESHED: 50,
	/** @type {number} `miliseconds` Delay between sending info about mouse direction */
	MOUSE_UPDATE_DELAY: 100,
	/** @type {number} `miliseconds` Pause after goal is scored */
	AFTER_GOAL_DELAY: 1000,
	/** @type {number} `miliseconds` All time for possible shoot */
	SHOT_ANIMATION_TIME: 500,
	/** @type {number} `miliseconds` Appearence of shot panel after shot was made  */
	SHOT_POWER_PANE_DELAY: 1000,
	/** @type {number} Max players count in team in one game */
	TEAM_MAX_PLAYERS: 3,
	/** @type {number} `miliseconds` Timing to get perfect shot power */
	get PERFECT_SHOT_TIME() { return this.SHOT_ANIMATION_TIME / 4; },
	/** @type {number} Max players count in one game  */
	get MAX_PLAYERS() { return this.TEAM_MAX_PLAYERS * 2; },
});
const BALL = Object.freeze({
	MASS: 1,
	RADIUS: 7,
	BONUS_SPEED_ON_ROTATE: 10,
	COLOR: "white",
});
const PLAYER = Object.freeze({
	RADIUS: 15,
	MASS: 5,
	SPEED_DEFAULT: 250,
	SPEED_ON_FORCE_ACTION: 150,
	SPEED_ON_HOLD: 75,
	PULL_FORCE: 6,
	KICK_FORCE: 1700,
	ASSIST_FORCE: 650,
	/*** Distance between Player and Ball where pull power works*/
	get PULL_DISTANCE_POWER() 		{ return (this.RADIUS * 10) ** 2; },
	get PLAYER_COLLISION_DISTANCE() { return (this.RADIUS * 2) ** 2; },
	get BALL_COLLISION_DISTANCE() 	{ return (this.RADIUS + BALL.RADIUS) ** 2; },
	get HOLD_BALL_DISTANCE() 		{ return this.BALL_COLLISION_DISTANCE * 4; },
	RED_COLOR: "red",
	BLUE_COLOR: "blue"
});
const PITCH = Object.freeze({
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
	get LEFT_BORDER() 	{ return this.PADDING_WIDTH + this.OUTLINE_WIDTH; },
	get RED_GOALKEEPER_POSITION_X() 	{ return this.RIGHT_BORDER - this.RADIUS * 2; },
	get BLUE_GOALKEEPER_POSITION_X() 	{ return this.LEFT_BORDER + this.RADIUS * 2; },
	get RED_MIDFIELDER_POSITION_X()		{ return this.FULL_X / 4 * 3; },
	get BLUE_MIDFIELDER_POSITION_X()	{ return this.FULL_X / 4; },
	get RED_FORWARD_POSITION_X() 	{ return this.FULL_X / 2 + this.CENTRAL_CIRCLE_RADIUS; },
	get BLUE_FORWARD_POSITION_X() 	{ return this.FULL_X / 2 - this.CENTRAL_CIRCLE_RADIUS; },
	GOAL_WIDTH: 100,
	GOAL_COLOR: "white",
	GOAL_DEPTH: 15,
	COLOR: "rgb(0, 255, 64)",
	CANVAS_BACKGROUND_COLOR: "rgb(255, 187, 0)",
	OUTLINE_COLOR: "white",
	CENTRAL_CIRCLE_RADIUS: 160,
	BORDER_LEFT_X: 0,
	RESISTANCE_DEFAULT: 0.99,
	RESISTANCE_ON_ASSIST: 1,
});
const MESSAGE = Object.freeze({
	CONNECTION: "connection",
	CONNECT: "connect",
	JOIN_GAME: "join_game",
	GAME_UPDATE: "update",
	GOAL: "goal",
	INPUT: "input",
	DISCONNECT: "disconnect",
});
const INPUT_TYPE = Object.freeze({
	KEY: "key",
	DIRECTION: "direction",
	SHOT: "shot",
	ASSIST: "assist",
});
const KEY_TYPE = Object.freeze({
	PULL: "pull",
	STOP: "stop",
	PUSH: "push",
	ROTATE_CLOCKWISE: "rotateClockwise",
	ROTATE_COUNTER_CLOCKWISE: "rotateCounterClockwise",
});
const DEVELOP = Object.freeze({
	SERVER_PORT: 4000,
	SERVER_ADRESS_IPV4: "localhost",
	SITE_FOLDER_NAME: "dist",
});


export {
	GAME,
	PLAYER,
	PITCH,
	BALL,
	MESSAGE,
	INPUT_TYPE,
	KEY_TYPE,
	DEVELOP,
};
