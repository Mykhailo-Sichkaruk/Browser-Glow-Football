const Constants = require('../shared/constants');
import { me } from './index';

let mouse;
let screenWidth;
let screenHeight;

let X_RATIO;
let Y_RATIO;

function MouseInput(e) {
    const dir = Math.atan2(e.clientX * X_RATIO - me.x, e.clientY * Y_RATIO - me.y);
    updateDirection(dir);
}

function MouseClick(){
    socket.emit(Constants.MSG_TYPES.MOUSE_CLICK, true);
    console.log('push')
} 

function updateDirection(dir) {
    socket.emit(Constants.MSG_TYPES.MOUSE_INPUT, dir);
}

function Space(res){
    console.log(res)
    socket.emit(Constants.MSG_TYPES.INPUT_SPACE, res);
}

function MoveLeft(dx) {
    let res = { x: (-dx), y: 0 };
    socket.emit(Constants.MSG_TYPES.INPUT, res);
}

function MoveRight(dx) {
    let res = { x: dx, y: 0 };
    socket.emit(Constants.MSG_TYPES.INPUT, res);
}

function MoveDown(dy) {
    let res = { x: 0, y: dy };
    socket.emit(Constants.MSG_TYPES.INPUT, res);
}

function MoveUp(dy) {
    let res = { x: 0, y: (-dy) };
    socket.emit(Constants.MSG_TYPES.INPUT, res);
}

let moveRate = 10;

const controller = {
    "Space": { pressed: false, func: Space },
}

document.addEventListener("keydown", (e) => {
    if (controller[e.code]) {
        controller[e.code].pressed = true
    } else
        console.log(e.code);
})
document.addEventListener("keyup", (e) => {
    if (controller[e.code]) {
        controller[e.code].pressed = false
    }
});

export function startInput() {
    setInterval(() => {
        Object.keys(controller).forEach(key => {
            controller[key].func(controller[key].pressed)
        })
    }, 50);
}


export function InitInput() {

    mouse = document.getElementById('mouse');
    document.addEventListener('mousemove', MouseInput);
    document.addEventListener('click', MouseClick);

    screenWidth = document.documentElement.clientWidth
    screenHeight = document.documentElement.clientHeight
    X_RATIO = Constants.PITCH.FULL_X / screenWidth
    Y_RATIO = Constants.PITCH.FULL_Y / screenHeight
    console.log(screenWidth + ' x ' + screenHeight)
    console.log(X_RATIO + ' R ' + Y_RATIO)

}