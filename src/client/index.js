const Constants = require('../shared/constants');
import './css/style.css';

document.addEventListener('DOMContentLoaded', function() {

let ping_tag = document.getElementById("ping");
let nickname_form = document.getElementById("nickname_form");
let start_game_button = document.getElementById("start_game_button");

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



function html_start(){
      nickname_form.style.display = "none";
      start_game_button.style.display = "none";
}
document.getElementById ("start_game_button").addEventListener ("click", start_game, false);


function start_game(){
      html_start();
      socket.emit(Constants.MSG_TYPES.JOIN_GAME, Date.now());
      socket.on(Constants.MSG_TYPES.GAME_UPDATE, apply_update)
}


ping();

}, false);
