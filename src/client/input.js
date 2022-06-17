/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const {PLAYER, BALL, PITCH, KEY_TYPE, INPUT_TYPE, GAME, MESSAGE} = require("../shared/constants");
import { throttle } from "lodash";
import { me } from "./index";
const line = document.getElementById("line");
const push = document.getElementById("push");

let X_RATIO = PITCH.FULL_X / document.documentElement.clientWidth;
let Y_RATIO = PITCH.FULL_Y / document.documentElement.clientHeight;


function handleMouseDirection(e) {
	const dir = Math.atan2(e.clientX * X_RATIO - me.x, e.clientY * Y_RATIO - me.y);
	socket.emit( MESSAGE.INPUT, { inputType:  INPUT_TYPE.DIRECTION, res: dir });
}

function handleRMBclick(e) {
	socket.emit( MESSAGE.INPUT, { inputType:  INPUT_TYPE.ASSIST, res: true });
	e.preventDefault();
}

function initPushPower() {
	const startTime = Date.now();

	push.setAttribute("style", "display: block;");
	line.setAttribute("style", "display: block;");
	line.style.animation = "push_line 0.5s linear 1";
	
	document.addEventListener("mouseup", () => {
		line.style.animationPlayState = "paused";
		let res = Date.now() - startTime;
		let pushPower;
		if (res <= GAME.SHOT_ANIMATION_TIME / 2)
			pushPower = (1 - Math.abs(res - GAME.SHOT_ANIMATION_TIME / 4) / (GAME.SHOT_ANIMATION_TIME / 4));
		else if (res >= GAME.SHOT_ANIMATION_TIME)
			pushPower = 0;
		else
			pushPower = (1 - Math.abs(res - (GAME.SHOT_ANIMATION_TIME / 4) * 3) / (GAME.SHOT_ANIMATION_TIME / 4));

		socket.emit( MESSAGE.INPUT, { inputType:  INPUT_TYPE.SHOT, res: pushPower });
		setTimeout(() => {
			push.style.display = "none";
			line.style.display = "none";
		}, GAME.SHOT_POWER_PANE_DELAY);
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
	"Space": 		{ pressed: false, type:  KEY_TYPE.PULL },
	"ShiftLeft": 	{ pressed: false, type:  KEY_TYPE.STOP },
	"KeyW": 		{ pressed: false, type:  KEY_TYPE.PUSH },
	"KeyA": 		{ pressed: false, type:  KEY_TYPE.ROTATE_CLOCKWISE },
	"KeyD": 		{ pressed: false, type:  KEY_TYPE.ROTATE_COUNTER_CLOCKWISE },
};

document.addEventListener("keydown", (e) => {
	if (controller[e.code]) {
		controller[e.code].pressed = true;
	} else
		console.log(e.code);
});
document.addEventListener("keyup", (e) => {
	if (controller[e.code]) {
		controller[e.code].pressed = false;
	}
});

export function initKeyboardInput() {
	setInterval(() => {
		let keyStatus = {};
		Object.keys(controller).forEach(key => {
			keyStatus[controller[key].type] = controller[key].pressed;
		});
		socket.emit( MESSAGE.INPUT, { inputType:  INPUT_TYPE.KEY, res: keyStatus });
	},  GAME.PING_ON_KEY_STATUS_REFRESHED_MS);
}

export function initMouseInput() {
	document.addEventListener("mousemove", _.throttle(handleMouseDirection, GAME.MOUSE_UPDATE_DELAY));
	document.addEventListener("mousedown", handleMouseClick);
	document.addEventListener("contextmenu", handleRMBclick, false);
	window.addEventListener("resize", () => {
		X_RATIO =  PITCH.FULL_X / document.documentElement.clientWidth;
		Y_RATIO =  PITCH.FULL_Y / document.documentElement.clientHeight;
	});
}