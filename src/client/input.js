/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const Constants = require("../shared/constants");
import { throttle } from "lodash";
import { me } from "./index";

let screenWidth;
let screenHeight;

let X_RATIO;
let Y_RATIO;
let line = document.getElementById("line");
let push = document.getElementById("push");

function handleMouseDirection(e) {
	const dir = Math.atan2(e.clientX * X_RATIO - me.x, e.clientY * Y_RATIO - me.y);
	if ( ((e.clientX * X_RATIO - me.x)**2 + (e.clientY  * Y_RATIO -me.y)**2) >= Constants.PLAYER.RADIUS ** 2)
		socket.emit(Constants.MSG_TYPE.INPUT, { inputType: Constants.INPUT_TYPE.DIRECTION, res: dir });
}

function handleRMBclick(e) {
	socket.emit(Constants.MSG_TYPE.INPUT, { inputType: Constants.INPUT_TYPE.ASSIST, res: true });
	e.preventDefault();
}

function initPushPower() {
	push.style.display = "block";
	line.style.display = "block";
	const animation_time = 500;
	line.style.animation = "push_line 0.5s linear 1";
	let time_start = Date.now();
	document.addEventListener("mouseup", () => {
		line.style.animationPlayState = "paused";
		let res = Date.now() - time_start;
		let push_power;
		if (res <= animation_time / 2)
			push_power = (1 - Math.abs(res - animation_time / 4) / (animation_time / 4));
		else if (res >= animation_time)
			push_power = 0;
		else
			push_power = (1 - Math.abs(res - (animation_time / 4) * 3) / (animation_time / 4));

		socket.emit(Constants.MSG_TYPE.INPUT, { inputType: Constants.INPUT_TYPE.SHOT, res: push_power });
		setTimeout(() => {
			push.style.display = "none";
			line.style.display = "none";
		}, 2000);
	}, { once: true });
}

function handleMouseClick(e) {
	switch (e.button) {
	case 0:
		initPushPower();
		break;
	}
}

const controller = {
	"Space": 		{ pressed: false, type: Constants.KEY_TYPE.PULL },
	"ShiftLeft": 	{ pressed: false, type: Constants.KEY_TYPE.STOP },
	"KeyW": 		{ pressed: false, type: Constants.KEY_TYPE.PUSH },
	"KeyA": 		{ pressed: false, type: Constants.KEY_TYPE.ROTATE_CLOCKWISE },
	"KeyD": 		{ pressed: false, type: Constants.KEY_TYPE.ROTATE_COUNTER_CLOCKWISE },
};

document.addEventListener("keydown", (e) => {
	let keyStatus = {};
	keyStatus[controller[e.code].type] = true;
	
	if (!controller[e.code].pressed)
		socket.emit(Constants.MSG_TYPE.INPUT, { inputType: Constants.INPUT_TYPE.KEY, res: keyStatus });
	
	if (controller[e.code]) {
		controller[e.code].pressed = true;
	} else
		console.log(e.code);
});

document.addEventListener("keyup", (e) => {
	if (controller[e.code]) {
		controller[e.code].pressed = false;

		let keyStatus = {};
		keyStatus[controller[e.code].type] = false;
		
		if (!controller[e.code].pressed)
			socket.emit(Constants.MSG_TYPE.INPUT, { inputType: Constants.INPUT_TYPE.KEY, res: keyStatus });
	}
});

export function initKeyboardInput() {
	// setInterval(() => {
	// 	let keyStatus = {};
	// 	let isImportant = false;

	// 	Object.keys(controller).forEach(key => {
	// 		keyStatus[controller[key].type] = controller[key].pressed;
	// 		isImportant += controller[key].pressed;
	// 	});

	// 	if (isImportant)
	// 		socket.emit(Constants.MSG_TYPE.INPUT, { inputType: Constants.INPUT_TYPE.KEY, res: keyStatus });
	// }, Constants.GAME.PING_ON_KEY_STATUS_REFRESHED_MS);
}

export function initMouseInput() {

	let mouse = document.getElementById("mouse");
	document.addEventListener("mousemove", _.throttle(handleMouseDirection, 10));
	document.addEventListener("mousedown", handleMouseClick);
	document.addEventListener("contextmenu", handleRMBclick, false);

	screenWidth = document.documentElement.clientWidth;
	screenHeight = document.documentElement.clientHeight;
	X_RATIO = Constants.PITCH.FULL_X / screenWidth;
	Y_RATIO = Constants.PITCH.FULL_Y / screenHeight;

}