module.exports = Object.freeze({
    PLAYER_RADIUS: 20,
    PLAYER_MAX_HP: 100,
    PLAYER_SPEED: 15,
    PLAYER_FIRE_COOLDOWN: 0.25,
    PLAYER: {
      RED_COLOR: 'red',
      BLUE_COLOR: 'blue'
    },

    BULLET_RADIUS: 3,
    BULLET_SPEED: 800,
    BULLET_DAMAGE: 10,
  
    SCORE_BULLET_HIT: 20,
    SCORE_PER_SECOND: 1,
  
    PITCH:{
      X: 1540,
      Y: 840,
      FULL_X: 1600,
      FULL_Y: 900,
      RADIUS: 50,
      PADDING_WIDTH: 10,
      OUTLINE_WIDTH: 20,
      GOAL_WIDTH: 220, //WIDTH
      COLOR: 'green',
      CANVAS_BACKGROUND_COLOR: 'white',
      OUTLINE_COLOR: 'red',
      CENTRAL_CIRCLE_RADIUS: 160
    },

    BALL: {
      MASS: 50, 
      RADIUS: 7,
      COLOR: 'white',
    },

    PLAYER_RADIUS: 10,
    
    SERVER_PING: 10,

    MSG_TYPES: {
      JOIN_GAME: 'join_game',
      GAME_UPDATE: 'update',
      INPUT: 'input',
      MOUSE_INPUT: 'mouse',
      GAME_OVER: 'dead',
      PING: 'ping',
    },
  });