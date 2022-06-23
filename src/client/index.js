import "./css/style.css";
import ReactDOM from "react-dom";
import { initInput, endInput } from "./input.js";
import { renderUpdate, initCanvas, clearCanvas } from "./render.js";
import { io } from "socket.io-client";
import { MESSAGE, GAME } from "../shared/constants.js";

export const socket = io({ autoConnect: false });
const root = ReactDOM.createRoot(document.getElementById("root"));
const nicknameFormDOM 		= document.getElementById("nickname_form");
const startGameButtonDOM 	= document.getElementById("start_game_button");
const redScoreDOM 			= document.getElementById("red_score");
const blueScoreDOM 			= document.getElementById("blue_score");
const scoreBoardDOM 		= document.getElementById("score_board");
const scoreEffectDOM 		= document.getElementById("score_effect");

let connectionStatus = true;
let currentUpdate;
let me;

const pingCounterFabric = () => {
	let pingSum = 0;
	let pingCount = 0;

	return updateSentTime => {
		const ping = Date.now() - updateSentTime;
		pingSum += ping;

		if (pingCount++ >= GAME.SERVER_PING) {
			pingSum /= pingCount;
			root.render(<Ping time={pingSum.toFixed(0)} />);
			pingCount = 0;
			pingSum = 0;
		}
	};
};

const pingCounter = pingCounterFabric();

window.onload = () => {
	initSocket();
};

function initSocket() {
	socket.on(MESSAGE.GAME_UPDATE, onUpdate);
	socket.on(MESSAGE.GOAL, onGoal);
	socket.on(MESSAGE.DISCONNECT, onDisconnect);
	socket.on(MESSAGE.CONNECT, onConnect);
	socket.connect();
}

function onDisconnect() {
	endGame();
	connectionStatus = false;
}

function onConnect() {
	document.getElementById("start_game_button").addEventListener("click", initGame, false);
	connectionStatus = true;
	root.render(<Ping time = "Connected"></Ping>);
}

function onUpdate(update) {
	currentUpdate = update;
	findMe(update);
	requestAnimationFrame(renderUpdate);
	pingCounter(update.timestamp);
}

function onGoal(result) {
	if (result.redTeamScored) {
		scoreEffectDOM.style.background = "blue";
	} else {
		scoreEffectDOM.style.background = "red";
	}
	scoreEffectDOM.style.display = "block";
	scoreEffectDOM.style.animation = "goal_effect 1s linear 1";
	setTimeout(() => {
		scoreEffectDOM.style.display = "none";
	}, GAME.AFTER_GOAL_DELAY_MS);

	blueScoreDOM.innerHTML = result.blue;
	redScoreDOM.innerHTML = result.red;
}

// eslint-disable-next-line no-unused-vars
const Ping = ({ time }) => (
	<div className="ping">
		<span>{time}</span>
	</div>
);

function findMe(update) {
	for (const player in update.players) {
		if (update.players[ player ].socket === socket.id) {
			me = update.players[ player ];
			break;
		}
	}
}

function startHtml() {
	if (connectionStatus) {
		nicknameFormDOM.style.display = "none";
		startGameButtonDOM.style.display = "none";
		scoreBoardDOM.style.display = "block";
		document.getElementById("canvas").setAttribute("class", "canvasWhileGame");
	} else {
		nicknameFormDOM.innerText = "Please wait to server connection";
	}
}

function initGame() {
	startHtml();
	initInput();
	initCanvas();
	socket.emit(MESSAGE.JOIN_GAME, nicknameFormDOM.value);
}

function endGame() {
	clearCanvas();
	endInput();
	document.getElementById("canvas").setAttribute("display", "none");
	document.getElementById("canvas").setAttribute("class", "canvasNew");
	document.getElementById("canvas").setAttribute("background", "white");
	nicknameFormDOM.style.display = "block";
	startGameButtonDOM.style.display = "block";
	scoreBoardDOM.style.display = "none";
	root.render(<Ping time={"Server disconnected"} />);
}

export { currentUpdate, me };
