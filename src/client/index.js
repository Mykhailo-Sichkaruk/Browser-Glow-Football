import "./css/style.css";
import ReactDOM from "react-dom";
import { initInput, endInput } from "./input.js";
import { initCanvas, clearCanvas } from "./render.js";
import { io } from "socket.io-client";
import { MESSAGE, GAME } from "../shared/constants.js";
import { addUpdate } from "./updates.js";

export const socket = io({ autoConnect: false });
const root = ReactDOM.createRoot(document.getElementById("root"));
const nicknameFormDOM 		= document.getElementById("nickname_form");
const startGameButtonDOM 	= document.getElementById("start_game_button");
const redScoreDOM 			= document.getElementById("red_score");
const blueScoreDOM 			= document.getElementById("blue_score");
const scoreBoardDOM 		= document.getElementById("score_board");
const scoreEffectDOM 		= document.getElementById("score_effect");

let currentUpdate;
let me;
let frames = 0;

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

// eslint-disable-next-line no-unused-vars
const Ping = ({ time }) => (
	<div className="ping">
		<span>{time}</span>
	</div>
);

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
}

function onConnect() {
	startGameButtonDOM.addEventListener("click", initGame);
	root.render(<Ping time = "Connected"></Ping>);
}

function onUpdate(update) {
	addUpdate(update);
	findMe(update);
	pingCounter(update.timestamp);
	frames++;
}

function onGoal(result) {
	if (result.teamScored)
		scoreEffectDOM.style.background = "blue";
	else
		scoreEffectDOM.style.background = "red";

	scoreEffectDOM.style.display = "block";
	scoreEffectDOM.style.animation = "goal_effect 1s linear 1";
	setTimeout(() => {
		scoreEffectDOM.style.display = "none";
	}, GAME.AFTER_GOAL_DELAY);

	blueScoreDOM.innerHTML = result.blueScore;
	redScoreDOM.innerHTML = result.redScore;
}

function findMe(update) {
	for (const player in update.players) {
		if (player === socket.id) {
			me = update.players[ player ];
			break;
		}
	}
}

function startHtml() {
	nicknameFormDOM.style.display = "none";
	startGameButtonDOM.style.display = "none";
	scoreBoardDOM.style.display = "block";
	document.getElementById("canvas").setAttribute("class", "canvasWhileGame");
}

function initGame() {
	startHtml();
	initInput();
	initCanvas();
	socket.emit(MESSAGE.JOIN_GAME, nicknameFormDOM.value);
	setInterval(() => { console.log(frames); frames = 0; }, 1000);
}

function endGame() {
	startGameButtonDOM.removeEventListener("click", initGame);
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
