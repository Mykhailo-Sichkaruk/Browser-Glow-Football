const Constants = require('../shared/constants');
import {me} from './index';

let mouse;

function MouseInput (e){
  const dir = Math.atan2(e.clientX - me.x,  e.clientY - me.y);
  updateDirection(dir);
  console.log(dir)
}

function updateDirection(dir){
  socket.emit(Constants.MSG_TYPES.MOUSE_INPUT, dir);
}

function MoveLeft(dx){
    let res = {x: (-dx), y: 0};
    socket.emit(Constants.MSG_TYPES.INPUT, res);
}

function MoveRight(dx){
    let res = {x: dx, y: 0};
    socket.emit(Constants.MSG_TYPES.INPUT, res);
}

function MoveDown(dy){
    let res = {x: 0, y: dy};
    socket.emit(Constants.MSG_TYPES.INPUT, res);
}

function MoveUp(dy){
    let res = {x: 0, y: (-dy)};
    socket.emit(Constants.MSG_TYPES.INPUT, res);
}

let moveRate = 10;

const controller = {
    "KeyW": {pressed: false, func: MoveUp},
    "KeyS": {pressed: false, func: MoveDown},
    "KeyD": {pressed: false, func: MoveRight},
    "KeyA": {pressed: false, func: MoveLeft},
  }

  document.addEventListener("keydown", (e) => {
    if(controller[e.code]){
      controller[e.code].pressed = true
    }
    else
        console.log(e.code);
  })
  document.addEventListener("keyup", (e) => {
    if(controller[e.code]){
      controller[e.code].pressed = false
    }
  });

 export function startInput() {
    setInterval( ()=> {
    Object.keys(controller).forEach(key=> {
      controller[key].pressed && controller[key].func(moveRate)
    }) 
  }, 50);
}


export function InitInput() {
    document.addEventListener('keypress', (event) => {
        if (event.code === "KeyS"){
            // Handle "down"
            MoveUp(moveRate);
        } else if (event.code === "KeyW"){
            // Handle "up"
            MoveUp(moveRate);
        } else if (event.code === "KeyA"){
            // Handle "left"
            MoveLeft(moveRate);
        } else if (event.code === "KeyD"){
            // Handle "right"
            MoveRight(moveRate);
        }
      }, false);
      mouse = document.getElementById('mouse');
      document.addEventListener('mousemove', MouseInput);
  }