const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const Constants = require('../shared/constants');
const Game = require('./game');
let game = new Game();

server.listen(3000);
app.use(express.static('dist'));
console.log('Server running on port 3000');

function createArray(x, y) {
  return Array.apply(null, Array(x)).map(e => Array(y));
}


function create_room(){
  let MAP = createArray(1920, 1080);
}


io.on('connection', socket => {
  console.log('Player connected!' + socket.id);

  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  socket.on(Constants.MSG_TYPES.INPUT, handleKeyboardInput);
  socket.on(Constants.MSG_TYPES.MOUSE_INPUT, handleMouseInput);
  socket.on('disconnect', onDisconnect);
  socket.on(Constants.MSG_TYPES.PING,(msg => {
    let res =  Date.now() - msg;
  io.emit(Constants.MSG_TYPES.PING, msg);
  }));
});


function onDisconnect(){
  game.removePlayer(this);
}

function joinGame(username) {
  game.addPlayer(this, username);
}

function handleKeyboardInput(res){
  game.handleKeyboardInput(this, res);
}

function handleMouseInput(res){
  game.handleMouseInput(this, res);
}






