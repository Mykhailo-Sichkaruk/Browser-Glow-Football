import { current_update } from "./index.js";
const {PLAYER, BALL, PITCH} = require("../shared/constants");

const canvas = document.getElementById("canvas");
let ctx;

function initCanvas() {
	ctx = canvas.getContext("2d");
	ctx.canvas.width = 1600;
	ctx.canvas.height = 900;
	console.log("Game screen inicializated: " + ctx.canvas.width + "x" + ctx.canvas.height);
}

let GOAL = {
	y1: ( PITCH.Y -  PITCH.GOAL_WIDTH) / 2 +  PITCH.OUTLINE_WIDTH +  PITCH.PADDING_WIDTH,
	y2:  PITCH.GOAL_WIDTH,
	x11:  PITCH.PADDING_WIDTH,
	x12:  PITCH.OUTLINE_WIDTH,
	x21:  PITCH.X +  PITCH.OUTLINE_WIDTH +  PITCH.PADDING_WIDTH,
	x22:  PITCH.OUTLINE_WIDTH,
};

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
	if (typeof stroke === "undefined") {
		stroke = true;
	}
	if (typeof radius === "undefined") {
		radius = 5;
	}
	if (typeof radius === "number") {
		radius = { tl: radius, tr: radius, br: radius, bl: radius };
	} else {
		var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
		for (var side in defaultRadius) {
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

function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
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
	roundRect(ctx,  PITCH.PADDING_WIDTH,  PITCH.PADDING_WIDTH,  PITCH.X + 2 *  PITCH.OUTLINE_WIDTH,  PITCH.Y + 2 *  PITCH.OUTLINE_WIDTH,  PITCH.RADIUS, true, false);
	//Set pitch color
	ctx.fillStyle =  PITCH.COLOR;
	//Draw pitch
	roundRect(ctx, ( PITCH.PADDING_WIDTH +  PITCH.OUTLINE_WIDTH), ( PITCH.PADDING_WIDTH +  PITCH.OUTLINE_WIDTH),  PITCH.X,  PITCH.Y,  PITCH.RADIUS, true, false);
	//Draw central circle
	ctx.strokeStyle = "white";
	ctx.beginPath();
	ctx.arc( PITCH.FULL_X / 2,  PITCH.FULL_Y / 2,  PITCH.CENTRAL_CIRCLE_RADIUS, 0, 2 * Math.PI, true);
	ctx.stroke();
	//Draw central line
	ctx.beginPath();      
	ctx.moveTo( PITCH.FULL_X/2, 0);    
	ctx.lineTo( PITCH.FULL_X/2,  PITCH.FULL_Y);  
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
	drawCircle(ctx, current_update.ball.x, current_update.ball.y,  BALL.RADIUS,  BALL.COLOR, "black", 1);

	//Draw every player
	current_update.players.forEach(p => {
		drawCircle(ctx, p.x, p.y,  PLAYER.RADIUS, (p.team == true) ? ( PLAYER.BLUE_COLOR) : ( PLAYER.RED_COLOR), "red", 1);
	});

}



export { renderUpdate, initCanvas };