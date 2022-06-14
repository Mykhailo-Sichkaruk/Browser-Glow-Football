/* eslint-disable no-undef */
import "./css/style.css";
import React from "react";
import ReactDOM from "react-dom";
import { initKeyboardInput, initMouseInput } from "./input";
import { renderUpdate, initCanvas } from "./render";

const Constants = require("../shared/constants");
const nickname_form = document.getElementById("nickname_form");
const start_game_button = document.getElementById("start_game_button");
const red_score = document.getElementById("red_score");
const blue_score = document.getElementById("blue_score");
const score_board = document.getElementById("score_board");
const score_effect = document.getElementById("score_effect");
const root = ReactDOM.createRoot(document.getElementById("root"));

let currentUpdate;
let me;

socket.on(Constants.MSG_TYPE.GAME_UPDATE, function (data) {
	currentUpdate = data;
	findMe(data);
	requestAnimationFrame(renderUpdate);
	pingCounter(data.t);
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

	update(currentUpdate) {
		//this.findMe(data);
		//requestAnimationFrame(renderUpdate);
		//this.setState({ currentUpdate });
	}

	findMe(update) { 
		for(let player in update.players) {
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


const pingCounterFabric = () => {
	let pingSum = 0;
	let pingCount = 0;
	let unstablePing = false;

	return (updateSentTime) => {
		const ping = Date.now() - updateSentTime;
		pingSum += ping;
		
		if (ping >= 150)
			unstablePing = true;
		
		if (pingCount++ >= Constants.SERVER_PING) {
			pingSum /= pingCount;
			root.render(<Ping time={pingSum.toFixed(0)} />);
			pingCount = 0;
			pingSum = 0;
		}	

		
	};
};


const pingCounter = pingCounterFabric();




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
	}, Constants.GAME.GOAL_EFFECT_DURATION);

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



export { currentUpdate as current_update, me };