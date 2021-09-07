const Constants = require('../shared/constants');
import { throttle } from 'lodash';
import { me } from './index';

let screenWidth;
let screenHeight;

let X_RATIO;
let Y_RATIO;
let line = document.getElementById("line");
let push = document.getElementById("push");

function MouseInput(e) {
    const dir = Math.atan2(e.clientX * X_RATIO - me.x, e.clientY * Y_RATIO - me.y);
    updateDirection(dir);
}

function RMBclick(e) {
    socket.emit(Constants.MSG_TYPES.RMB_CLICK, true);
    e.preventDefault();
}

function PushPower() {
    push.style.display = "block";
    line.style.display = "block";
    const animation_time = 500;
    line.style.animation = "push_line 0.5s linear 2";
    let time_start = Date.now();
    document.addEventListener('mouseup', () => {
        line.style.animationPlayState = 'paused';
        let res = Date.now() - time_start;
        let push_power;
        if (res <= animation_time / 2)
            push_power = (1 - Math.abs(res - animation_time / 4) / (animation_time / 4));
        else if (res >= animation_time * 2)
            push_power = 0;
        else
            push_power = (1 - Math.abs(res - (animation_time / 4) * 3) / (animation_time / 4));

        socket.emit(Constants.MSG_TYPES.LMB_CLICK, push_power);
        setTimeout(() => {
            push.style.display = "none";
            line.style.display = "none";
        }, 2000);
    }, { once: true });
    //document.removeEventListener('mouseup', );
    // 0 0.125 0.25 0.375 0.5 
}

function MouseClick(e) {
    switch (e.button) {
        case 0:
            PushPower();
            break;
    }
}

function updateDirection(dir) {
    socket.emit(Constants.MSG_TYPES.MOUSE_INPUT, dir);
}

function Space(res) {
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
    document.addEventListener('mousemove', _.throttle(MouseInput, 100));
    document.addEventListener('mousedown', MouseClick);
    document.addEventListener('contextmenu', RMBclick, false);

    screenWidth = document.documentElement.clientWidth
    screenHeight = document.documentElement.clientHeight
    X_RATIO = Constants.PITCH.FULL_X / screenWidth
    Y_RATIO = Constants.PITCH.FULL_Y / screenHeight
    console.log(screenWidth + ' x ' + screenHeight)
    console.log(X_RATIO + ' R ' + Y_RATIO)

}