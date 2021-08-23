const Constants = require('../shared/constants');
const Player = require('./player');
let Ball = require('./ball');


class Game {
    constructor() {
      this.sockets = {};
      this.players = {};
      this.ball = new Ball();
      this.pitch = {
        thickness: Constants.PITCH_BORDER_THICKNESS,
        width: Constants.MAP_SIZE_X,
        height: Constants.MAP_SIZE_Y
      };
      console.log('Ball created:' + this.ball)
      this.lastUpdateTime = Date.now();
      this.shouldSendUpdate = false;
      console.log('Game created');
      setInterval(() => {this.update();}, Constants.SERVER_PING);
    }

  
    addPlayer(socket, nickname) {
      console.log('Player:  '+ nickname + '  connected    (' + socket.id + ')' );
      this.sockets[socket.id] = socket;

      // Generate a position to start this player at.
      const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
      const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
      this.players[socket.id] = new Player(socket.id, nickname, x, y);
    }

    update(){
      this.colision();


      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate());
      });
    }

    colision(){
      Object.values(this.players).forEach(player => {
        if(this.IsTouch(player)){
          this.PlayerBall(player);
        }
      });
    }

    PlayerBall(player){
      let PlayerVector = {
        x: player.x - player.Px,
        y: player.y - player.Py,
      }
      let BallVector = {
        x : this.ball.x - this.ball.Px,
        y : this.ball.y - this.ball.Py,
      }
      let PowerVector = {
        x : this.ball.x - player.x,
        y : this.ball.y - player.y,
      }

      this.ball.x += PowerVector.x;
      this.ball.y += PowerVector.y;
    }

    createUpdate(){
      
      return {
        t: Date.now(),
        ball: this.ball,
        players: Object.values(this.players),
      };
    }

    removePlayer(socket){
      delete this.sockets[socket.id];
      delete this.players[socket.id];
    }

    handleInput(socket, res){
      if (this.players[socket.id]) {
        this.players[socket.id].Px = this.players[socket.id].x;
        this.players[socket.id].Py = this.players[socket.id].y;
        this.players[socket.id].x += res.x;
        this.players[socket.id].y += res.y;
      }
    }

    IsTouch(player){
      let distance =  (this.ball.x - player.x)**2 + (this.ball.y - player.y)**2;
      let collision_distance = this.ball.radius + player.radius;
      //console.log(this.ball.radius +  '    '   +   player.radius)
      if(distance > collision_distance**2)
        return false;
      else
      return true;
    }
  
  }


  module.exports = Game;
