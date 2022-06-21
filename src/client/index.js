/* eslint-disable no-undef */
import "./css/style.css";
import React from "react";
import ReactDOM from "react-dom";
import { initInput, endInput } from "./input";
import { renderUpdate, initCanvas, clearCanvas } from "./render";

const { MESSAGE, GAME } = require("../shared/constants");
const nicknameFormDOM = document.getElementById("nickname_form");
const startGameButtonDOM = document.getElementById("start_game_button");
const redScoreDOM = document.getElementById("red_score");
const blueScoreDOM = document.getElementById("blue_score");
const scoreBoardDOM = document.getElementById("score_board");
const scoreEffectDOM = document.getElementById("score_effect");
const root = ReactDOM.createRoot(document.getElementById("root"));

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


socket.on(MESSAGE.GAME_UPDATE, data => {
	currentUpdate = data;
	findMe(data);
	requestAnimationFrame(renderUpdate);
	pingCounter(data.timestamp);
});

socket.on(MESSAGE.GOAL, res => {
	if (res.redTeamScored) {
		scoreEffectDOM.style.background = "blue";
	} else {
		scoreEffectDOM.style.background = "red";
	}
	scoreEffectDOM.style.display = "block";
	scoreEffectDOM.style.animation = "goal_effect 1s linear 1";
	setTimeout(() => {
		scoreEffectDOM.style.display = "none";
	}, GAME.AFTER_GOAL_DELAY_MS);

	blueScoreDOM.innerHTML = res.blue;
	redScoreDOM.innerHTML = res.red;
});

socket.on("disconnect", () => {
	endGame();
	connectionStatus = false;
});

socket.on("connect", () => {
	startGameButtonDOM.addEventListener("click", initGame, false);
	connectionStatus = true;
	root.render(<Ping time = "Connected"></Ping>);
});
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
