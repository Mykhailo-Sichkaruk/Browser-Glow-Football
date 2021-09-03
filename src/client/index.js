import './css/style.css';
import { startInput, InitInput } from './input';
import { renderUpdate, initCanvas } from './render';

const Constants = require('../shared/constants');
let ping_button = document.getElementById("ping");
let nickname_form = document.getElementById("nickname_form");
let start_game_button = document.getElementById("start_game_button");

let score_board = document.getElementById("score_board");
let current_update;
let me;

function ping(current_update_time) {
    ping_button.innerHTML = (Date.now()  - current_update_time) + ' ms';
}

socket.on(Constants.MSG_TYPES.GAME_UPDATE, function(data) {
    current_update = data;
    findMe(data);
    requestAnimationFrame(renderUpdate);
    ping(data.t);
});

socket.on(Constants.MSG_TYPES.GOAL, function(res) {
    score_board.innerHTML = '<font color="blue">' + res.blue + '</font>'+ ':' + '<font color="red">' + res.red + '</font>' 
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