import { currentUpdate } from "./index.js";
import { PLAYER, BALL, PITCH } from "../shared/constants.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const GOAL = {
	y1: (PITCH.Y -  PITCH.GOAL_WIDTH) / 2 +  PITCH.OUTLINE_WIDTH +  PITCH.PADDING_WIDTH,
	y2:  PITCH.GOAL_WIDTH,
	x11:  PITCH.PADDING_WIDTH,
	x12:  PITCH.OUTLINE_WIDTH,
	x21:  PITCH.X +  PITCH.OUTLINE_WIDTH +  PITCH.PADDING_WIDTH,
	x22:  PITCH.OUTLINE_WIDTH,
};

async function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initCanvas() {
	ctx.canvas.width = PITCH.FULL_X;
	ctx.canvas.height = PITCH.FULL_Y;
	console.log("Game screen inicializated: " + ctx.canvas.width + "x" + ctx.canvas.height);
}

function roundRect(x, y, width, height, fill, radius = 5, stroke = true) {
	if (typeof radius === "number") {
		radius = { tl: radius, tr: radius, br: radius, bl: radius };
	} else {
		const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
		for (const side in defaultRadius) {
			radius[side] = radius[side] || defaultRadius[side];
		}
	}
	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + width - radius.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	ctx.lineTo(x + width, y + height - radius.br);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	ctx.lineTo(x + radius.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();
	if (fill) {
		ctx.fill();
	}
	if (stroke) {
		ctx.stroke();
	}

}

function drawCircle(x, y, radius, fill, stroke, strokeWidth) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
	if (fill) {
		ctx.fillStyle = fill;
		ctx.fill();
	}
	if (stroke) {
		ctx.lineWidth = strokeWidth;
		ctx.strokeStyle = stroke;
		ctx.stroke();
	}
}

function drawPitch() {
	//Set pitch outline color
	ctx.fillStyle =  PITCH.OUTLINE_COLOR;
	//Draw big pitch for outline
	roundRect(PITCH.PADDING_WIDTH, PITCH.PADDING_WIDTH,  PITCH.X + 2 *  PITCH.OUTLINE_WIDTH,  PITCH.Y + 2 *  PITCH.OUTLINE_WIDTH, true, PITCH.RADIUS, false);
	//Set pitch color
	ctx.fillStyle =  PITCH.COLOR;
	//Draw pitch
	roundRect((PITCH.PADDING_WIDTH +  PITCH.OUTLINE_WIDTH), (PITCH.PADDING_WIDTH +  PITCH.OUTLINE_WIDTH),  PITCH.X,  PITCH.Y, true, PITCH.RADIUS, false);
	//Draw central circle
	ctx.strokeStyle = "white";
	ctx.beginPath();
	ctx.arc(PITCH.FULL_X / 2,  PITCH.FULL_Y / 2,  PITCH.CENTRAL_CIRCLE_RADIUS, 0, 2 * Math.PI, true);
	ctx.stroke();
	//Draw central line
	ctx.beginPath();
	ctx.moveTo(PITCH.FULL_X / 2, 0);
	ctx.lineTo(PITCH.FULL_X / 2,  PITCH.FULL_Y);
	ctx.stroke();
	//Erase GOAL SPACE
	ctx.clearRect(GOAL.x11, GOAL.y1, GOAL.x12, GOAL.y2);
	ctx.clearRect(GOAL.x21, GOAL.y1, GOAL.x22, GOAL.y2);
}

function renderUpdate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear screen
	//////////////////////////////////////////////////////////////////

	//Draw backgroung/pitch
	drawPitch();

	//Draw ball
	drawCircle(currentUpdate.ball.x, currentUpdate.ball.y,  BALL.RADIUS,  BALL.COLOR, "black", 1);

	//Draw every player
	for (const player of currentUpdate.players) {
		const teamColor = (player.team) ? (PLAYER.BLUE_COLOR) : (PLAYER.RED_COLOR);
		drawCircle(player.x, player.y, PLAYER.RADIUS, teamColor, "black", 1);
	}

}


export { renderUpdate, initCanvas, clearCanvas };
