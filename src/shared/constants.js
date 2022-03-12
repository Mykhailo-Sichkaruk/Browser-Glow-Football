module.exports = Object.freeze({
    SERVER_PING: 20,

    PLAYER: {
        RADIUS: 15,
        MASS: 5,
        SPEED: 200,
        NITRO_VELOSITY: 150, //push veloity
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
        GOAL_WIDTH: 100, //WIDTH
        COLOR: 'rgb(0, 255, 64)',
        CANVAS_BACKGROUND_COLOR: 'rgb(255, 187, 0)',
        OUTLINE_COLOR: 'white',
        CENTRAL_CIRCLE_RADIUS: 160,
        BORDER_LEFT_X: 0,
    }, 

    BALL: {
        MASS: 1,
        RADIUS: 7,
        COLOR: 'white',
    },

    PHYSICS: {
        PUSH_SPEED: 2000,
        ASSIST_SPEED : 800,
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