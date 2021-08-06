module.exports = Object.freeze({
    PLAYER_RADIUS: 20,
    PLAYER_MAX_HP: 100,
    PLAYER_SPEED: 400,
    PLAYER_FIRE_COOLDOWN: 0.25,
  
    BULLET_RADIUS: 3,
    BULLET_SPEED: 800,
    BULLET_DAMAGE: 10,
  
    SCORE_BULLET_HIT: 20,
    SCORE_PER_SECOND: 1,
  
    MAP_SIZE: 1000,
    MAP_SIZE_X: 1920,
    MAP_SIZE_Y: 1080,

    BALL_RADIUS: 50,
    PLAYER_RADIUS: 100,
    

    MSG_TYPES: {
      JOIN_GAME: 'join_game',
      GAME_UPDATE: 'update',
      INPUT: 'input',
      GAME_OVER: 'dead',
      PING: 'ping',
    },
  });