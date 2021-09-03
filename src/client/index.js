import './css/style.css';
import { startInput, InitInput } from './input';
import { renderUpdate, initCanvas } from './render';

const Constants = require('../shared/constants');
let ping_button = document.getElementById("ping");
let nickname_form = document.getElementById("nickname_form");
let start_game_button = document.getElementById("start_game_button");
let red_score = document.getElementById("red_score");
let blue_score = document.getElementById("blue_score");
let score_board = document.getElementById("score_board");
let score_effect = document.getElementById("score_effect");
let current_update;
let me;

function ping(current_update_time) {
    ping_button.innerHTML = (Date.now() - current_update_time) + ' ms';
}

socket.on(Constants.MSG_TYPES.GAME_UPDATE, function (data) {
    current_update = data;
    findMe(data);
    requestAnimationFrame(renderUpdate);
    ping(data.t);
});

socket.on(Constants.MSG_TYPES.GOAL, function (res) {
    if (res.team_scored == true) {
        score_effect.style.background = "blue";
        score_effect.style.display = "block";
        score_effect.style.animation = "goal_effect 1s linear 1";
    }
    else{
        score_effect.style.background = "red";
        score_effect.style.display = "block";
        score_effect.style.animation = "goal_effect 1s linear 1";
    }
    setTimeout(() => {
        score_effect.style.display = "none";
    }, 1000)

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

function html_start() {
    nickname_form.style.display = "none";
    start_game_button.style.display = "none";
    score_board.style.display = "block"
    document.getElementById("canvas").style.background = Constants.PITCH.CANVAS_BACKGROUND_COLOR;
}

document.getElementById("start_game_button").addEventListener("click", start_game, false);


function start_game() {
    html_start();
    InitInput();
    startInput();
    initCanvas();
    socket.emit(Constants.MSG_TYPES.JOIN_GAME, nickname_form.value);
}

export { current_update, me };