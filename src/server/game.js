const Constants = require('./shared/constants');


class Game {
    constructor() {
      this.sockets = {};
      this.players = {};
      this.ball = {};
      this.lastUpdateTime = Date.now();
      this.shouldSendUpdate = false;
      setInterval(this.update.bind(this), 1000 / 60);
    }
  
    addPlayer(socket, username) {
      this.sockets[socket.id] = socket;
  
      // Generate a position to start this player at.
      const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
      const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
      this.players[socket.id] = new Player(socket.id, username, x, y);
    }
  
  }


  