const Constants = require('./src/shared/constants');

class Player extends ObjectClass {
    constructor(id, username, x, y) {
      super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
      this.username = username;
      this.hp = Constants.PLAYER_MAX_HP;
      this.fireCooldown = 0;
      this.score = 0;
    }
}

class Object{
    constructor(){
        this.x = Math.random() * 20;
        this.y = Math.random() * 20;
        this.velosity = Constants.PLAYER_SPEED;
        this.radius = Constants.PLAYER_RADIUS;
        this.hp = Constants.PLAYER_MAX_HP;
        this.state = true;
        this.direction = 1;
    }
    
    update(dx, dy){
        //this.x += dt * this.velosity * Math.cos(direction);
        this.x += dx;
        this.y += dy; 
    }
}
    
class Player extends Object{
    constructor(x, y, velosity, size_x, size_y, hp, state){
        super(x, y, velosity, size_x, size_y, hp, state);
    }
}

class ball extends Object{
    constructor(){
        super(x, y, velosity, size_x, size_y, hp, state);
        this.x = Constants.MAP_SIZE_X/2;
        this.y = Constants.MAP_SIZE_Y/2;
        this.radius = Constants.BALL_RADIUS;
    }
}