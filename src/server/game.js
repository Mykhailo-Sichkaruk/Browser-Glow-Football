const Constants = require('../shared/constants');
const Player = require('./player');
let Ball = require('./ball');


class Game {
    constructor() {
      this.sockets = {};
      this.players = {};
      this.ball = new Ball();
      this.lastUpdateTime = Date.now();
      this.shouldSendUpdate = false;
      this.players_count = 0;
      this.BLUE_score = 0;
      this.RED_score = 0;
      this.BLUE_players_count = 0;
      this.RED_players_count = 0;
      setInterval(() => {this.update();}, Constants.SERVER_PING);
    }

  
    addPlayer(socket, nickname) {
      this.players_count++;
      const team = this.players_count%2;
      const team_name= (team==true)?('BLUE'):('RED ');
      (team==true)?(this.BLUE_players_count++):(this.RED_players_count++);
      console.log(team_name + ':    '+ nickname + ':  connected:    on socket: ( ' + socket.id + ' )' );
      this.sockets[socket.id] = socket;

      // Generate a position to start this player at.
      const x = Constants.PITCH.FULL_X/3 + Constants.PITCH.FULL_X/3 * (!team);
      const y = Constants.PITCH.FULL_Y/5 * ((team==true)?((this.BLUE_players_count%3) + 2):((this.RED_players_count%3) + 2));
      this.players[socket.id] = new Player(socket.id, nickname, x, y, team);
    }

    update(){
      //Process movement
      this.move((this.lastUpdateTime - Date.now())/1000);
      //Process update
      this.colision();

      //Send update to all players
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate());
      });
      this.lastUpdateTime = Date.now();
    }

    move(dt){
      Object.values(this.players).forEach(player => {
        player.move(dt);
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
      this.players_count--;
      delete this.sockets[socket.id];
      delete this.players[socket.id];
    }

    handleKeyboardInput(socket, res){
      if (this.players[socket.id]) {
        this.players[socket.id].Px = this.players[socket.id].x;
        this.players[socket.id].Py = this.players[socket.id].y;
        this.players[socket.id].x += res.x;
        this.players[socket.id].y += res.y;
      }
    }

    handleMouseInput(socket, dir){
      this.players[socket.id].dir = dir;
    }

    IsTouch(player){
      let current_distance =  (this.ball.x - player.x)**2 + (this.ball.y - player.y)**2;
      let collision_distance = this.ball.radius + player.radius;
      //console.log(this.ball.radius +  '    '   +   player.radius)
      if(current_distance > collision_distance**2)
        return false;
      else
      return true;
    }
  
  }


  module.exports = Game;
