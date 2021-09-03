const Constants = require('../shared/constants');
const Player = require('./player');
let Ball = require('./ball');


class Game {
    constructor() {
        this.sockets = {}; 
        this.players = {};
        this.ball = new Ball();
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        this.players_count = 0;
        this.BLUE_score = 0;
        this.RED_score = 0;
        this.BLUE_players_count = 0;
        this.RED_players_count = 0;
        this.PlayerBall_ColisonDistance = (Constants.BALL.RADIUS + Constants.PLAYER.RADIUS) ** 2;
        this.PlayerPlayer_ColisonDistance = 160;
        setInterval(() => { this.update(); }, Constants.SERVER_PING);
    }

    update() {
        //Process colision
        this.colision();
        //Process movement
        this.move((this.lastUpdateTime - Date.now()) / 1000);
        //Send update to all players
        Object.keys(this.sockets).forEach(playerID => {
            const socket = this.sockets[playerID];
            socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate());
        });
        this.lastUpdateTime = Date.now();
    }

    move(dt) {
        //Move ball
        let res;
        if((res = this.ball.move(dt)) == 2)
            this.goal(true);
        else if(res == 1)
            this.goal(false);
        //Move all players
        Object.values(this.players).forEach(function(player) {
            player.move(dt);
        });
    }

    colision() {
        let i = 0;

        for (let socket in this.players) {
            switch (this.IsBallTouch(socket)) {
                case 0: this.players[socket].velosity = Constants.PLAYER.SPEED;
                    break;
                case 1: this.PlayerBall(socket);
                    break;
                case 2: this.PlayerPullsBall(socket);
                    break;
                case 3: this.PlayerPushBall(socket); //Push
                    break;
                case 4: this.PlayerAssistBall(socket); //Assist
                    break;
                case 5: this.players[socket].velosity = Constants.PLAYER.NITRO_VELOSITY;
                    break;
                
            }
            this.players[socket].push = 0;
            this.players[socket].assist = false;
            this.PlayerPlayerCollision(socket, i);

            i++;
        }

    }

    PlayerBall(player) {
        let PowerVector = Math.atan2(this.ball.x - this.players[player].x, this.ball.y - this.players[player].y);
        this.ball.direction = (this.ball.direction + PowerVector) / 2;
        this.ball.velosity = ((this.players[player].mass - this.ball.mass) * this.players[player].velosity + 2 * this.ball.mass) / (this.players[player].mass + this.ball.mass) * 2;
    }

    PlayerPullsBall(socket){
        this.players[socket].velosity = Constants.PLAYER.PULL_SPEED;
        this.ball.x = this.players[socket].x + (this.players[socket].radius *Math.sin(this.players[socket].direction));
        this.ball.y = this.players[socket].y + (this.players[socket].radius *Math.cos(this.players[socket].direction)); 
        this.ball.direction = this.players[socket].direction;
        this.ball.velosity  = this.players[socket].velosity;
    }

    PlayerPushBall(socket, velosity){
        this.ball.x = this.players[socket].x + ((this.players[socket].radius + this.ball.radius + 2) *Math.sin(this.players[socket].direction));
        this.ball.y = this.players[socket].y + ((this.players[socket].radius + this.ball.radius + 2) *Math.cos(this.players[socket].direction)); 
        this.ball.direction = this.players[socket].direction;
        this.ball.velosity  = this.players[socket].push * Constants.PHYSICS.PUSH_SPEED;
    }

    PlayerAssistBall(socket){
        this.ball.x = this.players[socket].x + ((this.players[socket].radius + this.ball.radius + 2) *Math.sin(this.players[socket].direction));
        this.ball.y = this.players[socket].y + ((this.players[socket].radius + this.ball.radius + 2) *Math.cos(this.players[socket].direction)); 
        this.ball.direction = this.players[socket].direction;
        this.ball.velosity  = Constants.PHYSICS.ASSIST_SPEED;
    }

    IsBallTouch(socket) {
        let current_distance = (this.ball.x - this.players[socket].x) ** 2 + (this.ball.y - this.players[socket].y) ** 2;
        if (current_distance <= this.PlayerBall_ColisonDistance){
            if(this.players[socket].gravity == true){
                
                if(this.players[socket].push != 0)
                    return 3; //Player Hold the ball and push it in same time
                else if(this.players[socket].assist == true)
                    return 4; //Player assist
                else
                    return 2; //Player pulls the ball
            }
                else
                return 1; //Just collision
        }
        else{
            if(this.players[socket].gravity == true)
                return 5; //Player gets Nitro
            else
                return 0;
        }
    }

    PlayerPlayerCollision(player, me_index) {
        let i = 0;
        for (let other in this.players) {
            if (i > me_index) {
                let current_distance = (this.players[other].x - this.players[player].x) ** 2 + (this.players[other].y - this.players[player].y) ** 2;
                if (current_distance <= (Constants.PLAYER.RADIUS ** 2) * 2) {
                    //Process colision = change directions and speed 
                    let PowerVector = Math.atan2(this.players[other].x - this.players[player].x, this.players[other].y - this.players[player].y);
                    this.players[other].direction = (this.players[other].direction + PowerVector) / 2;
                    this.players[player].direction = (this.players[player].direction + PowerVector) / 2;
                    this.players[other].move(0.1);
                    this.players[player].move(0.1);
                    // ((player.mass - this.ball.mass)*player.velosity + 2*this.ball.mass)/(player.mass + this.ball.mass)*2;
                }
            }
            i++;
        }
    }

    goal(team){
        //Set ball to center
        this.ball.x = Constants.PITCH.FULL_X / 2;
        this.ball.y = Constants.PITCH.FULL_Y / 2;
        this.ball.velosity = 0;
        //Set Players to start
        let red_number = 1;
        let blue_number = 1;
        for(let socket in this.players){
            //For blue tam
            if(this.players[socket].team == true && (blue_number == 1 || blue_number == 2)){
                this.players[socket].x = Constants.PITCH.FULL_X * (1 / 6);
                this.players[socket].y = Constants.PITCH.FULL_Y / 3 * blue_number;
                blue_number++;
            }
            else if(this.players[socket].team == true && (blue_number == 3)){
                this.players[socket].x = Constants.PITCH.FULL_X / 3;
                this.players[socket].y = Constants.PITCH.FULL_Y / 2;
            }
            else if(this.players[socket].team == false && (red_number == 1 || red_number == 2)){
                this.players[socket].x = Constants.PITCH.FULL_X * (5 / 6);
                this.players[socket].y = Constants.PITCH.FULL_Y / 3 * red_number;
                red_number++;
            }
            else if(this.players[socket].team == false && (red_number == 3)){
                this.players[socket].x = Constants.PITCH.FULL_X * (2 / 3);
                this.players[socket].y = Constants.PITCH.FULL_Y * (1 / 2);
            }
            this.players[socket].velosity = 0;
        }

        let res
        if(team == true){
            this.RED_score++;
            res = {
                blue: this.BLUE_score,
                red: this.RED_score,
            }
        }
        else{
            this.BLUE_score++;
            res = {
                blue: this.BLUE_score,
                red: this.RED_score,
            }
        }

        Object.keys(this.sockets).forEach(playerID => {
            const socket = this.sockets[playerID];
            socket.emit(Constants.MSG_TYPES.GOAL, res);
        });
    }

    createUpdate() {

        return {
            t: Date.now(),
            ball: this.ball,
            players: Object.values(this.players),
        };
    }

    addPlayer(socket, nickname) {
        this.players_count++;
        const team = this.players_count % 2;
        const team_name = (team == true) ? ('BLUE'.blue) : ('RED '.red);
        (team == true) ? (this.BLUE_players_count++) : (this.RED_players_count++);
        this.sockets[socket.id] = socket;

        // Generate a position to start this player at.
        const x = Constants.PITCH.FULL_X / 3 + Constants.PITCH.FULL_X / 3 * (!team);
        const y = Constants.PITCH.FULL_Y / 5 * ((team == true) ? ((this.BLUE_players_count % 3) + 2) : ((this.RED_players_count % 3) + 2));
        //Add player to global players array
        this.players[socket.id] = new Player(socket.id, nickname, x, y, team);
        console.log(team_name + ':    ' + nickname.bold + ':  connected:  on socket: ( ' + socket.id + ' )');

    }

    removePlayer(socket) {
        delete this.sockets[socket.id];
        delete this.players[socket.id];
        this.players_count--;
    }

    handleKeyboardInput(socket, res) {
        if (this.players[socket.id]) {
            this.players[socket.id].Px = this.players[socket.id].x;
            this.players[socket.id].Py = this.players[socket.id].y;
            this.players[socket.id].x += res.x;
            this.players[socket.id].y += res.y;
        }
    }

    handleMouseInput(socket, dir) {
        if(this.players.hasOwnProperty(`${socket.id}`))
            this.players[socket.id].direction = dir;
    }

    HandleSpaceKey(socket, res){
        if(this.players.hasOwnProperty(`${socket.id}`))
            this.players[socket.id].gravity = res;
    }

    handleLMBClick(socket, res){
        if(this.players.hasOwnProperty(`${socket.id}`))
            this.players[socket.id].push = res**2;
    }

    handleRMBClick(socket, res){
        if(this.players.hasOwnProperty(`${socket.id}`))
            this.players[socket.id].assist = true;
    }

}


module.exports = Game;