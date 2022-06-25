// eslint-disable-next-line strict
"use strict";
const GAME = Object.freeze({
	LEFT_TEAM: "left",
	RIGHT_TEAM: "right",
	AFTER_GOAL_DELAY_MS: 1000, //ms
	PING_ON_KEY_STATUS_REFRESHED_MS: 50,
	SERVER_PING: 20,
	SHOT_ANIMATION_TIME: 500, //ms
	get PERFECT_SHOT_TIME() { return this.SHOT_ANIMATION_TIME / 4; },
	SHOT_POWER_PANE_DELAY: 1000, //ms
	MOUSE_UPDATE_DELAY: 100, //ms
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
	ASSIST_FORCE: 800,
	/*** Distance between Player and Ball where pull power works*/
	PULL_DISTANCE_POWER: 75 ** 2,
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
	get LEFT_BORDER() { return this.PADDING_WIDTH + this.OUTLINE_WIDTH; },
	get RED_GOALKEEPER_POSITION_X() { return this.RIGHT_BORDER - this.RADIUS * 2; },
	get BLUE_GOALKEEPER_POSITION_X() { return this.LEFT_BORDER + this.RADIUS * 2; },
	get RED_MIDFIELDER_POSITION_X() { return this.FULL_X / 4; },
	get BLUE_MIDFIELDER_POSITION_X() { return this.FULL_X / 4 * 3; },
	get RED_FORWARD_POSITION_X() { return this.FULL_X / 2 + this.CENTRAL_CIRCLE_RADIUS; },
	get BLUE_FORWARD_POSITION_X() { return this.FULL_X / 2 - this.CENTRAL_CIRCLE_RADIUS; },
	GOAL_WIDTH: 100, //WIDTH
	COLOR: "rgb(0, 255, 64)",
	CANVAS_BACKGROUND_COLOR: "rgb(255, 187, 0)",
	OUTLINE_COLOR: "white",
	CENTRAL_CIRCLE_RADIUS: 160,
	BORDER_LEFT_X: 0,
	RESISTANCE: 0.99,
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
	SERVER_PORT: 3000,
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
