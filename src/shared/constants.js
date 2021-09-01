module.exports = Object.freeze({
    SERVER_PING: 15,

    PLAYER: {
        RADIUS: 10,
        MASS: 10,
        SPEED: 150,
        NITRO_VELOSITY: 300,
        PULL_SPEED: 75,
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
        COLOR: 'rgb(0, 255, 64)',
        CANVAS_BACKGROUND_COLOR: 'white',
        OUTLINE_COLOR: 'white',
        CENTRAL_CIRCLE_RADIUS: 160
    },

    BALL: {
        MASS: 1,
        RADIUS: 7,
        COLOR: 'white',
    },

    PHYSICS: {
        PUSH_POWER: 16,
        ASSIST_POWER : 8
    },

    MSG_TYPES: {
        JOIN_GAME: 'join_game',
        GAME_UPDATE: 'update',
        INPUT: 'input',
        INPUT_SPACE: 'input_space',
        MOUSE_INPUT: 'mouse',
        LMB_CLICK: 'lmb_click',
        RMB_CLICK: 'rmb_click',
        GAME_OVER: 'dead',
        PING: 'ping',
        DISCONNECT: 'disconnect',
        GOAL: 'goal',
    },
});