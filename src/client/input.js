const Constants = require('../shared/constants');


function updateXPosition(dx){
    let res = {x: dx, y: 0};
    socket.emit(Constants.MSG_TYPES.INPUT, res);
}

function updateYPosition(dy){
    let res = {x: 0, y: dy};
    socket.emit(Constants.MSG_TYPES.INPUT, res);
}

let moveRate = 10;

export function startCapturingInput() {
    document.addEventListener('keypress', (event) => {
        if (event.code === "KeyS"){
            // Handle "down"
            updateYPosition(moveRate);
        } else if (event.code === "KeyW"){
            // Handle "up"
            updateYPosition(-moveRate);
        } else if (event.code === "KeyA"){
            // Handle "left"
            updateXPosition(-moveRate);
        } else if (event.code === "KeyD"){
            // Handle "right"
            updateXPosition(moveRate);
        }
      }, false);
  }