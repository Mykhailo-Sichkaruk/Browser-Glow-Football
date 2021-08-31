module.exports = Object.freeze({

    PLAYER: {
        RADIUS: 10,
        MAX_HP: 100,
        SPEED: 150,
        MASS: 10,
        FIRE_COOLDOWN: 0.25,
        RED_COLOR: 'red',
        BLUE_COLOR: 'blue'
    },


    PITCH: {
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
        MASS: 1,
        RADIUS: 7,
        COLOR: 'white',
    },

    SERVER_PING: 7,

    PHYSICS: {
        PUSH_POWER: 8
    },

    MSG_TYPES: {
        JOIN_GAME: 'join_game',
        GAME_UPDATE: 'update',
        INPUT: 'input',
        INPUT_SPACE: 'input_space',
        MOUSE_INPUT: 'mouse',
        MOUSE_CLICK: 'mouse_click',
        GAME_OVER: 'dead',
        PING: 'ping',
        DISCONNECT: 'disconnect'
    },
});