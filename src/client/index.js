import './css/style.css';
import { startInput, InitInput } from './input';
import { renderUpdate, initCanvas } from './render';

const Constants = require('../shared/constants');
let nickname;
let ping_button = document.getElementById("ping");
let nickname_form = document.getElementById("nickname_form");
let start_game_button = document.getElementById("start_game_button");

let body = document.getElementById("body"); //Sketch for leaderboard 
let tbl = document.createElement("table");
let tblBody = document.createElement("tbody"); 

let current_update;
let me;

let pong_resieved = false;

function ping() {

    socket.on('ping', function(msg) {
        pong_resieved = true;
        ping_button.innerHTML = 'Ping: ' + (Date.now() - msg) + ' ms';
    });

    setInterval(() => {
        pong_resieved = false;
        socket.emit('ping', Date.now());
        if (!pong_resieved) {
            ping_button.innerHTML = 'Connection lost';
        }
    }, 500);
}

socket.on(Constants.MSG_TYPES.PING, function(msg) {
    pong_resieved = true;
    ping_button.innerHTML = 'Ping: ' + (Date.now() - msg) + ' ms';
});


socket.on(Constants.MSG_TYPES.GAME_UPDATE, function(data) {
    current_update = data;
    findMe(data);
    requestAnimationFrame(renderUpdate);
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
    canvas.style.background = 'grey';
}

document.getElementById("start_game_button").addEventListener("click", start_game, false);


function start_game() {
    html_start();
    InitInput();
    startInput();
    initCanvas();
    nickname = nickname_form.value;
    socket.emit(Constants.MSG_TYPES.JOIN_GAME, nickname);
}

ping();

export { current_update, me };