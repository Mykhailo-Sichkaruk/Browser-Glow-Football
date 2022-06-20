/* eslint-disable no-undef */
import "./css/style.css";
import React from "react";
import ReactDOM from "react-dom";
import { initKeyboardInput, initMouseInput } from "./input";
import { renderUpdate, initCanvas } from "./render";

const { MESSAGE, PITCH, GAME } = require("../shared/constants");
const nicknameFormDOM = document.getElementById("nickname_form");
const startGameButtonDOM = document.getElementById("start_game_button");
const redScoreDOM = document.getElementById("red_score");
const blueScoreDOM = document.getElementById("blue_score");
const scoreBoardDOM = document.getElementById("score_board");
const scoreEffectDOM = document.getElementById("score_effect");
const root = ReactDOM.createRoot(document.getElementById("root"));
document.getElementById("start_game_button").addEventListener("click", startGame, false);
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

class Ping extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="ping">
				{this.props.time + "ms"}
			</div>
		);
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.child = React.createRef();
		this.state = {
			lastUpdateTime: 0,
			myData: props.myData,
			currentUpdate: props.currentUpdate,
		};



	}
	findMe(update) {
		for (const player in update.players) {
			if (update.players[ player ].socket === socket.id) {
				//me = update.players[ player ];
				this.setState({ myData: update.players[player] });
				break;
			}
		}
	}

	render() {
		<Ping time="100000"/>;
	}

}

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

function findMe(update) {
	for (const player in update.players) {
		if (update.players[ player ].socket === socket.id) {
			me = update.players[ player ];
			break;
		}
	}
}

function startHtml() {
	nicknameFormDOM.style.display = "none";
	startGameButtonDOM.style.display = "none";
	scoreBoardDOM.style.display = "block";
	document.getElementById("canvas").style.background = PITCH.CANVAS_BACKGROUND_COLOR;
}

function startGame() {
	startHtml();
	initMouseInput();
	initKeyboardInput();
	initCanvas();
	socket.emit(MESSAGE.JOIN_GAME, nicknameFormDOM.value);
}



export { currentUpdate, me };
