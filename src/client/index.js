const Constants = require('../shared/constants');
import { LibraryTemplatePlugin } from 'webpack';
import './css/style.css';
import { startCapturingInput } from './input';

//import {renderUpdate} from './render';



let ping_button = document.getElementById("ping");
let nickname_form = document.getElementById("nickname_form");
let start_game_button = document.getElementById("start_game_button");
let body = document.getElementById("body");

let tbl = document.createElement("table");
let tblBody = document.createElement("tbody");

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;
let background = new Image();
background.src = ".../public/accets/background.svg";


console.log(canvas.width + 'x' + canvas.height);

let current_update;

function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
      if (fill) {
        ctx.fillStyle = fill
        ctx.fill()
      }
      if (stroke) {
        ctx.lineWidth = strokeWidth
        ctx.strokeStyle = stroke
        ctx.stroke()
      }
    }

function renderUpdate(){
    ctx.fillStyle = "#FFFF00";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(current_update.ball.x, current_update.ball.y);
    drawCircle(ctx, current_update.ball.x, current_update.ball.y, Constants.BALL.RADIUS, Constants.BALL.COLOR, 'black');
    current_update.players.forEach(p => {
      //console.log(p.nickname + '  ||  ' + p.x + '  ||  ' + p.y);
      //ctx.fillRect(p.x, p.y, Constants.PLAYER_RADIUS, Constants.PLAYER_RADIUS);
      drawCircle(ctx, p.x, p.y, Constants.PLAYER_RADIUS, 'black', 'red', 2);

      //ctx.fillRect(10, 10, 100, 100);
    });
   
}



let pong_resieved = false;

function ping(){

      socket.on('ping', function(msg) {
            pong_resieved = true;
            ping_button.innerHTML =  'Ping: ' + (Date.now() - msg) + ' ms';
      });

      setInterval(() => {
      pong_resieved = false;
      socket.emit('ping', Date.now());
      if(!pong_resieved)
      {
            ping_button.innerHTML =  'Connection lost';
      }
      }, 500); 
}

socket.on(Constants.MSG_TYPES.PING, function(msg) {
      pong_resieved = true;
      ping_button.innerHTML =  'Ping: ' + (Date.now() - msg) + ' ms';
});


socket.on(Constants.MSG_TYPES.GAME_UPDATE, function(data) {
      current_update = data;
      console.log(data)
      /*data.players.forEach(p => {
                 console.log(p.nickname)}); */
      requestAnimationFrame(renderUpdate);
      });

function html_start(){
      nickname_form.style.display = "none";
      start_game_button.style.display = "none";
      canvas.style.background = "white";
}

document.getElementById("start_game_button").addEventListener ("click", start_game, false);


function start_game(){
      html_start();
      startCapturingInput();
      let nickname = nickname_form.value;
      socket.emit(Constants.MSG_TYPES.JOIN_GAME, nickname);

}




ping();







//export {update};

