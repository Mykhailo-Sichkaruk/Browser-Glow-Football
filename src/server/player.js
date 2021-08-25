const Constants = require('../shared/constants');

class Player{
    constructor(socket, nickname, x, y, team) {
        this.socket = socket;
        this.nickname = nickname;
        this.team = team;
        this.x = x;
        this.y = y;
        this.Px = x;
        this.Py = y;
        this.direction = 0;

        this.velosity = Constants.PLAYER_SPEED;
        this.radius = Constants.PLAYER_RADIUS;
        this.hp = Constants.PLAYER_MAX_HP;
        this.state = true;
        
        this.hp = Constants.PLAYER_MAX_HP;
        this.fireCooldown = 0;
        this.score = 0;
    }

    move(dt){
        this.x += dt * this.velosity * Math.sin(this.direction);
        this.y -= dt * this.velosity * Math.cos(this.direction);
    }
}




module.exports = Player;
