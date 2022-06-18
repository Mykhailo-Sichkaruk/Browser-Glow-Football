/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { throttle } from "lodash";
import { me } from "./index";

const {PLAYER, BALL, PITCH, KEY_TYPE, INPUT_TYPE, GAME, MESSAGE} = require("../shared/constants");
const line = document.getElementById("line");
const push = document.getElementById("push");
const controller = {
	"Space": 		{ pressed: false, type:  KEY_TYPE.PULL },
	"ShiftLeft": 	{ pressed: false, type:  KEY_TYPE.STOP },
	"KeyW": 		{ pressed: false, type:  KEY_TYPE.PUSH },
	"KeyA": 		{ pressed: false, type:  KEY_TYPE.ROTATE_CLOCKWISE },
	"KeyD": 		{ pressed: false, type:  KEY_TYPE.ROTATE_COUNTER_CLOCKWISE },
};

let keyStatusInterval;
let xRatio = PITCH.FULL_X / document.documentElement.clientWidth;
let yRatio = PITCH.FULL_Y / document.documentElement.clientHeight;


function handleMouseDirection(e) {
	const dir = Math.atan2(e.clientX * xRatio - me.x, e.clientY * yRatio - me.y);
	socket.emit( MESSAGE.INPUT, { inputType:  INPUT_TYPE.DIRECTION, res: dir });
}

function handleRMBclick(e) {
	e.preventDefault();
	assist();
}

function kick() {
	const startTime = Date.now();
	
	push.setAttribute("style", "display: block;");
	line.setAttribute("style", "display: block;");
	line.style.animation = "push_line " + GAME.SHOT_ANIMATION_TIME/1000 + "s linear 1";
	
	document.addEventListener("mouseup", () => {
		const realTime = Date.now() - startTime;
		line.style.animationPlayState = "paused";
		let pushPower;
		
		if (realTime <= GAME.SHOT_ANIMATION_TIME / 2)
			pushPower = 1 - (Math.abs(GAME.PERFECT_SHOT_TIME - realTime) / GAME.PERFECT_SHOT_TIME);
		else if (realTime >= GAME.SHOT_ANIMATION_TIME) {
			push.style.display = "none";
			line.style.display = "none";
			return;
		}
		else
			pushPower = 1 - (Math.abs(GAME.PERFECT_SHOT_TIME * 3 - realTime) / GAME.PERFECT_SHOT_TIME );
			
		//Send kick power to server
		socket.emit(MESSAGE.INPUT, { inputType: INPUT_TYPE.SHOT, res: pushPower });

		stopSendKeyStatus();

		//Hide push power
		setTimeout(() => {
			startSendKeyStatus();
			
			push.style.display = "none";
			line.style.display = "none";
		}, GAME.SHOT_ANIMATION_TIME);
	}, { once: true });

}

function assist() {
	socket.emit(MESSAGE.INPUT, { inputType: INPUT_TYPE.ASSIST, res: true });

	stopSendKeyStatus();
	setTimeout(() => {
		startSendKeyStatus();
	}, GAME.SHOT_ANIMATION_TIME);
}

function handleMouseClick(e) {
	switch (e.button) {
	case 0:
		kick();
		break;
	}
}

function startListenKeys() {
	document.addEventListener("keydown", pressKey, true);
	document.addEventListener("keyup", unpressKey, true);
}

function endListenKeys() {
	document.removeEventListener("keydown", pressKey, true);
	document.removeEventListener("keyup", unpressKey, true);
}

function unpressKey(e) {
	if (controller[e.code]) {
		controller[e.code].pressed = false;
	}
}

function pressKey(e) {	
	if (controller[e.code]) {
		controller[e.code].pressed = true;
	} else
		console.log(e.code);
}

function startSendKeyStatus() {
	keyStatusInterval = setInterval(() => {
		const keyStatus = {};
		
		for (const key in controller)
			keyStatus[ controller[ key ].type ] = controller[ key ].pressed;
		
		socket.emit(MESSAGE.INPUT, { inputType: INPUT_TYPE.KEY, res: keyStatus });
	}, GAME.PING_ON_KEY_STATUS_REFRESHED_MS);

}

function stopSendKeyStatus() {
	clearInterval(keyStatusInterval);
}

export function initKeyboardInput() {
	startListenKeys();
	keyStatusInterval = setInterval(() => {
		const keyStatus = {};
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
		xRatio =  PITCH.FULL_X / document.documentElement.clientWidth;
		yRatio =  PITCH.FULL_Y / document.documentElement.clientHeight;
	});
}