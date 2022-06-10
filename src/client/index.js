/* eslint-disable no-undef */
import "./css/style.css";
import React from "react";
import { initKeyboardInput, initMouseInput } from "./input";
import { renderUpdate, initCanvas } from "./render";

const Constants = require("../shared/constants");
const ping_button = document.getElementById("ping");
const nickname_form = document.getElementById("nickname_form");
const start_game_button = document.getElementById("start_game_button");
const red_score = document.getElementById("red_score");
const blue_score = document.getElementById("blue_score");
const score_board = document.getElementById("score_board");
const score_effect = document.getElementById("score_effect");
let currentUpdate;
let me;

function ping(current_update_time) {
	ping_button.innerHTML = (Date.now() - current_update_time) + " ms";
}

socket.on(Constants.MSG_TYPE.GAME_UPDATE, function (data) {
	currentUpdate = data;
	findMe(data);
	requestAnimationFrame(renderUpdate);
	ping(data.t);
});

socket.on(Constants.MSG_TYPE.GOAL, function (res) {
	if (res.team_scored) {
		score_effect.style.background = "blue";
	}
	else {
		score_effect.style.background = "red";
	}
	score_effect.style.display = "block";
	score_effect.style.animation = "goal_effect 1s linear 1";
	setTimeout(() => {
		score_effect.style.display = "none";
	}, 1000);

	blue_score.innerHTML = res.blue;
	red_score.innerHTML = res.red;
});

function findMe(update) {
	update.players.forEach(player => {
		if (player.socket == socket.id) {
			let res = {
				x: player.x,
				y: player.y
			};
			me = res;
			return;
		}
	});
}

function startHtml() {
	nickname_form.style.display = "none";
	start_game_button.style.display = "none";
	score_board.style.display = "block";
	document.getElementById("canvas").style.background = Constants.PITCH.CANVAS_BACKGROUND_COLOR;
}

document.getElementById("start_game_button").addEventListener("click", startGame, false);


function startGame() {
	startHtml();
	initMouseInput();
	initKeyboardInput();
	initCanvas();
	socket.emit(Constants.MSG_TYPE.JOIN_GAME, nickname_form.value);
}


class Ping extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			time: 1,
		};
	}

	componentDidMount() {
		this.timerID = setInterval(
			() => this.ping(),
			1000);
	}

	ping() {

	}

	render() {
		return (
			<div>
				<h1>Hello, world!</h1>
				<h2>It is me.</h2>
			</div>
		);
	}
}

export { currentUpdate as current_update, me };