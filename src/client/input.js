const Constants = require('../shared/constants');
import { me } from './index';

let screenWidth;
let screenHeight;

let X_RATIO;
let Y_RATIO;

function MouseInput(e) {
    const dir = Math.atan2(e.clientX * X_RATIO - me.x, e.clientY * Y_RATIO - me.y);
    updateDirection(dir);
}

function RMBclick(e){
        socket.emit(Constants.MSG_TYPES.RMB_CLICK, true);
        e.preventDefault();
}

function MouseClick(e){
    switch (e.button) {
        case 0:
            socket.emit(Constants.MSG_TYPES.LMB_CLICK, true);
          break;
        case 1:
            console.log('MMB');
          break;

      }


}
 



function updateDirection(dir) {
    socket.emit(Constants.MSG_TYPES.MOUSE_INPUT, dir);
}

function Space(res){
    socket.emit(Constants.MSG_TYPES.INPUT_SPACE, res);
}

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

    let mouse = document.getElementById('mouse');
    document.addEventListener('mousemove', MouseInput);
    document.addEventListener('mouseup', MouseClick);
    document.addEventListener('contextmenu', RMBclick, false);
    screenWidth = document.documentElement.clientWidth
    screenHeight = document.documentElement.clientHeight
    X_RATIO = Constants.PITCH.FULL_X / screenWidth
    Y_RATIO = Constants.PITCH.FULL_Y / screenHeight
    console.log(screenWidth + ' x ' + screenHeight)
    console.log(X_RATIO + ' R ' + Y_RATIO)

}