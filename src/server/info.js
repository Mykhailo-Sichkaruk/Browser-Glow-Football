const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Constants = require('../shared/constants');
const webpackConfig = require('../../webpack.dev.js');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

server.listen(3000);


if (process.env.NODE_ENV === 'development') {
  // Setup Webpack for development
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler));
  console.log('server running on port 3000')


} else {
  // Static serve the dist/ folder in production
  app.use(express.static('./src/client/html'));
  console.log('server running on port 3000')
}

function createArray(x, y) {
  return Array.apply(null, Array(x)).map(e => Array(y));
}


function create_room(){
  let MAP = createArray(1920, 1080);
}


io.on('connection', socket => {
  console.log('Player connected!', socket.id + '  ' + socket);

  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  //socket.on(Constants.MSG_TYPES.INPUT, handleInput);
  //socket.on('disconnect', onDisconnect);
  socket.on('ping',(msg => {
    let res =  Date.now() - msg;
  io.emit('ping', msg);
  }));
});


function joinGame(username) {
  game.addPlayer(this, username);
}






