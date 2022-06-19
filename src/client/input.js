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


function kick(event) {
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

function assist(event) {
	event.preventDefault();
	stopSendKeyStatus();
	socket.emit(MESSAGE.INPUT, { inputType: INPUT_TYPE.ASSIST, res: true });

	setTimeout(() => {
		startSendKeyStatus();
	}, GAME.SHOT_ANIMATION_TIME*2);
}

function handleMouseClick(event) {
	switch (event.button) {
	case 0: //Left click
		kick();
		//console.log("Left click");
		break;
	case 1: //Middle click
		//console.log("Middle click");
		break;
	case 2: //Right click
		//console.log("Right click");
		break;
	}
}

function handleMouseMove(event) {
	if (!((event.clientX * xRatio - me.x)**2 + (event.clientY  * yRatio -me.y)**2) >= PLAYER.RADIUS ** 2)
		return;
	
	const dir = Math.atan2(event.clientX * xRatio - me.x, event.clientY * yRatio - me.y);
	socket.emit( MESSAGE.INPUT, { inputType:  INPUT_TYPE.DIRECTION, res: dir });
}

function startListenKeys() {
	document.addEventListener("keydown", pressKey, true);
	document.addEventListener("keyup", unpressKey, true);
}

function endListenKeys() {
	document.removeEventListener("keydown", pressKey, true);
	document.removeEventListener("keyup", unpressKey, true);
}

function unpressKey(event) {
	if (controller[event.code]) {
		controller[event.code].pressed = false;
	}
}

function pressKey(event) {	
	if (controller[event.code]) {
		controller[event.code].pressed = true;
	} else
		console.log(event.code);
}

function startSendKeyStatus() {
	keyStatusInterval = setInterval(() => {
		const keyStatus = {};
		let isImportant = false;
		
		for (const key in controller) {
			keyStatus[ controller[ key ].type ] = controller[ key ].pressed;
			isImportant += controller[key].pressed;
		}

		if(isImportant)
			socket.emit(MESSAGE.INPUT, { inputType: INPUT_TYPE.KEY, res: keyStatus });
		
	}, GAME.PING_ON_KEY_STATUS_REFRESHED_MS);

}

function stopSendKeyStatus() {
	clearInterval(keyStatusInterval);
}

export function initKeyboardInput() {
	startListenKeys();
	startSendKeyStatus();
}

export function initMouseInput() {
	document.addEventListener("mousemove", _.throttle(handleMouseMove, GAME.MOUSE_UPDATE_DELAY));
	document.addEventListener("mousedown", handleMouseClick);
	document.addEventListener("contextmenu", assist, false);
	window.addEventListener("resize", () => {
		xRatio =  PITCH.FULL_X / document.documentElement.clientWidth;
		yRatio =  PITCH.FULL_Y / document.documentElement.clientHeight;
	});
}