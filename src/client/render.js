import { currentUpdate } from "./index.js";
import { PLAYER, BALL, PITCH } from "../shared/constants.js";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasBackground = document.getElementById("canvas-background");
const ctxBackground = canvasBackground.getContext("2d");

const GOAL = {
	y1: (PITCH.Y - PITCH.GOAL_WIDTH) / 2 + PITCH.OUTLINE_WIDTH + PITCH.PADDING_WIDTH,
	y2:   PITCH.GOAL_WIDTH,
	x11:  PITCH.PADDING_WIDTH,
	x12:  PITCH.OUTLINE_WIDTH,
	x21:  PITCH.X + PITCH.OUTLINE_WIDTH + PITCH.PADDING_WIDTH,
	x22:  PITCH.OUTLINE_WIDTH,
};

async function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctxBackground.clearRect(0, 0, canvas.width, canvas.height);
}

function initCanvas() {
	ctxBackground.canvas.width = PITCH.FULL_X;
	ctxBackground.canvas.height = PITCH.FULL_Y;
	requestAnimationFrame(drawBackground);

	ctx.canvas.width = PITCH.FULL_X;
	ctx.canvas.height = PITCH.FULL_Y;

	console.log("Game screen inicializated: " + ctx.canvas.width + "x" + ctx.canvas.height);
}

function drawCircle(x, y, radius, fill) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
	if (fill) {
		ctx.fillStyle = fill;
		ctx.fill();
	}
}

function renderUpdate() {
	// eslint-disable-next-line no-self-assign
	canvas.width = canvas.width;
	ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear screen

	//Draw ball
	drawCircle(currentUpdate.ball.x, currentUpdate.ball.y,  BALL.RADIUS,  BALL.COLOR);

	//Draw every player
	for (const player of currentUpdate.players) {
		const teamColor = (player.team) ? (PLAYER.BLUE_COLOR) : (PLAYER.RED_COLOR);
		drawCircle(player.x, player.y, PLAYER.RADIUS, teamColor);
	}
}

function drawBackground() {
	//Set pitch color
	ctxBackground.fillStyle = PITCH.COLOR;
	//Draw pitch
	drawRoundRectBackground((PITCH.PADDING_WIDTH + PITCH.OUTLINE_WIDTH), (PITCH.PADDING_WIDTH + PITCH.OUTLINE_WIDTH), PITCH.X, PITCH.Y, true, PITCH.RADIUS, false);
	//Draw central circle
	ctxBackground.strokeStyle = PITCH.OUTLINE_COLOR;
	ctxBackground.beginPath();
	ctxBackground.arc(PITCH.FULL_X / 2, PITCH.FULL_Y / 2, PITCH.CENTRAL_CIRCLE_RADIUS, 0, 2 * Math.PI, true);
	ctxBackground.stroke();
	//Draw central line
	ctxBackground.beginPath();
	ctxBackground.moveTo(PITCH.FULL_X / 2, PITCH.TOP_BORDER);
	ctxBackground.lineTo(PITCH.FULL_X / 2, PITCH.BOTTOM_BORDER);
	ctxBackground.stroke();
	//Erase GOAL SPACE
	ctxBackground.fillStyle = PITCH.GOAL_COLOR;
	ctxBackground.fillRect(GOAL.x11, GOAL.y1, GOAL.x12, GOAL.y2);
	ctxBackground.fillRect(GOAL.x21, GOAL.y1, GOAL.x22, GOAL.y2);
}

function drawRoundRectBackground(x, y, width, height, fill, radius = 5, stroke = true) {
	ctxBackground.beginPath();
	ctxBackground.moveTo(x + radius, y);
	ctxBackground.lineTo(x + width - radius, y);
	ctxBackground.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctxBackground.lineTo(x + width, y + height - radius);
	ctxBackground.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctxBackground.lineTo(x + radius, y + height);
	ctxBackground.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctxBackground.lineTo(x, y + radius);
	ctxBackground.quadraticCurveTo(x, y, x + radius, y);
	ctxBackground.closePath();
	if (fill) {
		ctxBackground.fill();
	}
	if (stroke) {
		ctxBackground.stroke();
	}

}


export { renderUpdate, initCanvas, clearCanvas };
