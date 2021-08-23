const Constants = require('../shared/constants');


function updateXPosition(dx){
    let res = {x: dx, y: 0};
    socket.emit(Constants.MSG_TYPES.INPUT, res);
}

function MoveUp(dx){
    let res = {x: -dx, y: 0};
    socket.emit(Constants.MSG_TYPES.INPUT, res);
}

function MoveDown(dx){
    let res = {x: dx, y: 0};
    socket.emit(Constants.MSG_TYPES.INPUT, res);
}

function MoveRight(dy){
    let res = {x: 0, y: dy};
    socket.emit(Constants.MSG_TYPES.INPUT, res);
}

function MoveLeft(dy){
    let res = {x: 0, y: dy};
    socket.emit(Constants.MSG_TYPES.INPUT, res);
}

let moveRate = 10;

/*const controller = {
    87: {pressed: false, func: MoveUp},
    83: {pressed: false, func: MoveDown},
    38: {pressed: false, func: MoveUp},
    40: {pressed: false, func: MoveDown},
  }

  document.addEventListener("keydown", (e) => {
    if(controller[e.keyCode]){
      controller[e.keyCode].pressed = true
    }
  })
  document.addEventListener("keyup", (e) => {
    if(controller[e.keyCode]){
      controller[e.keyCode].pressed = false
    }
  });*/

 export function startInput() {
    setInterval(executeMoves = () => {
    Object.keys(controller).forEach(key=> {
      controller[key].pressed && controller[key].func(moveRate)
    }) 
  }, 20);
}


export function startCapturingInput() {
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
  }