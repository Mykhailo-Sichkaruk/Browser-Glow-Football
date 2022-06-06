const Constants = require('../shared/constants');
const Player = require('./player');
let Ball = require('./ball');


class Game {
    constructor() {
        this.sockets = {};
        this.players = {};
        this.ball = new Ball();
        this.lastUpdateTime = Date.now();
        this.players_count = 0;
        this.BLUE_score = 0;
        this.RED_score = 0;
        this.BLUE_players_count = 0;
        this.RED_players_count = 0;
        this.PlayerBall_ColisonDistance = (Constants.BALL.RADIUS + Constants.PLAYER.RADIUS) ** 2;
        this.PlayerPlayer_ColisonDistance = (Constants.PLAYER.RADIUS * 2) ** 2;

        //Start updating
        setInterval(() => { this.update(); }, Constants.SERVER_PING);
    }

    update() {
        const dt = (this.lastUpdateTime - Date.now()) / 1000;
        //Process colision
        this.colision(dt);
        //Process movement
        this.move(dt);
        //Send update to all players
        this.sendUpdate();
        //Save time of last update
        this.lastUpdateTime = Date.now();
    }

    move(dt) {
        //Move ball
        let res;
        if ((res = this.ball.move(dt)) === 2)
            this.goal(true);
        else if (res === 1)
            this.goal(false);
        //Move all players
        Object.values(this.players).forEach(function(player) {
            player.move(dt);
        });
    }

    colision(dt) {
        let i = 0;

        for (let socket in this.players) {
            switch (this.IsBallTouch(socket, dt)) {
                case 0:
                    this.players[socket].velosity = Constants.PLAYER.SPEED;
                    break;
                case 1:
                    this.PlayerBall(socket);
                    break;
                case 2:
                    this.PlayerPullsBall(socket);
                    break;
                case 3:
                    this.PlayerPushBall(socket); //Push
                    break;
                case 4:
                    this.PlayerAssistBall(socket); //Assist
                    break;
                case 5:
                    this.players[socket].velosity = Constants.PLAYER.NITRO_VELOSITY;
                    break;

            }
            this.players[socket].push = 0;
            this.players[socket].assist = false;
            this.PlayerPlayerCollision(socket, i);

            i++;
        }

    }

    sendUpdate() {
        const update = this.createUpdate()
        Object.keys(this.sockets).forEach(playerID => {
            const socket = this.sockets[playerID];
            socket.emit(Constants.MSG_TYPES.GAME_UPDATE, update);
        });
    }

    PlayerBall(player) {
        const PowerVector = Math.atan2(this.ball.x - this.players[player].x, this.ball.y - this.players[player].y);
        this.ball.direction = PowerVector;
        this.ball.velosity = ((this.players[player].mass - this.ball.mass) * this.players[player].velosity + 2 * this.ball.mass) / (this.players[player].mass + this.ball.mass) * 2;
    }

    PlayerPullsBall(socket) {
        this.players[socket].velosity = Constants.PLAYER.PULL_SPEED;
        this.ball.x = this.players[socket].x + (this.players[socket].radius * Math.sin(this.players[socket].direction));
        this.ball.y = this.players[socket].y + (this.players[socket].radius * Math.cos(this.players[socket].direction));
        this.ball.direction = this.players[socket].direction;
        this.ball.velosity = this.players[socket].velosity;
    }

    PlayerPushBall(socket) {
        this.ball.x = this.players[socket].x + ((this.players[socket].radius + this.ball.radius + 2) * Math.sin(this.players[socket].direction));
        this.ball.y = this.players[socket].y + ((this.players[socket].radius + this.ball.radius + 2) * Math.cos(this.players[socket].direction));
        this.ball.direction = this.players[socket].direction;
        this.ball.velosity = Constants.PHYSICS.PUSH_SPEED;
    }

    PlayerAssistBall(socket) {
        this.ball.x = this.players[socket].x + ((this.players[socket].radius + this.ball.radius + 2) * Math.sin(this.players[socket].direction));
        this.ball.y = this.players[socket].y + ((this.players[socket].radius + this.ball.radius + 2) * Math.cos(this.players[socket].direction));
        this.ball.direction = this.players[socket].direction;
        this.ball.velosity = Constants.PHYSICS.ASSIST_SPEED;
    }

    IsBallTouch(socket, dt) {
        const ball_y = this.ball.x - dt * this.ball.velosity * Math.cos(this.ball.direction);
        const ball_x = this.ball.y - dt * this.ball.velosity * Math.sin(this.ball.direction);

        const player_y = this.players[socket].x - dt * this.players[socket].velosity * Math.cos(this.players[socket].direction);
        const player_x = this.players[socket].y - dt * this.players[socket].velosity * Math.sin(this.players[socket].direction);

        const current_distance = (ball_y - player_y) ** 2 + (ball_x - player_x) ** 2;

        if (current_distance <= this.PlayerBall_ColisonDistance) {
            if (this.players[socket].gravity === true) {

                if (this.players[socket].push != 0)
                    return 3; //Player Hold the ball and push it in same time
                else if (this.players[socket].assist === true)
                    return 4; //Player assist
                else
                    return 2; //Player pulls the ball
            } else
                return 1; //Just collision
        } else {
            if (this.players[socket].gravity === true)
                return 5; //Player gets Nitro
            else
                return 0; //No collision
        }
    }

    PlayerPlayerCollision(player, me_index) {
        let i = 0;
        for (let other in this.players) {
            if (i > me_index) {
                let current_distance = (this.players[other].x - this.players[player].x) ** 2 + (this.players[other].y - this.players[player].y) ** 2;
                if (current_distance <= (Constants.PLAYER.RADIUS ** 2) * 2) {
                    //Process colision = change directions and speed 
                    let dir = this.players[other].direction
                    this.players[other].direction = this.players[player].direction
                    this.players[player].direction = dir;
                }
            }
            i++;
        }
    }

    goal(team) {
        //Set ball to center
        this.ball.x = Constants.PITCH.FULL_X / 2;
        this.ball.y = Constants.PITCH.FULL_Y / 2;
        this.ball.velosity = 0;
        //Set Players to start
        let red_number = 1;
        let blue_number = 1;

        for (let socket in this.players) {
            //For blue tam
            if (this.players[socket].team) {
                this.players[socket].x = (Constants.PITCH.FULL_X / 2) * (blue_number / 3);
                this.players[socket].y = Constants.PITCH.FULL_Y / 2;
                blue_number++;
            } else if (!this.players[socket].team) {
                this.players[socket].x = (Constants.PITCH.FULL_X / 2) + (Constants.PITCH.FULL_X / 2) * (red_number / 3);
                this.players[socket].y = Constants.PITCH.FULL_Y / 2;
                red_number++;
            }

            this.players[socket].velosity = 0;
            this.players[socket].gravity = false;
            this.players[socket].push = false;
            this.players[socket].push = false;
        }

        let res
        if (team === true) {
            this.RED_score++;
            res = {
                team_scored: false,
                blue: this.BLUE_score,
                red: this.RED_score,
            }
        } else {
            this.BLUE_score++;
            res = {
                team_scored: true,
                blue: this.BLUE_score,
                red: this.RED_score,
            }
        }

        this.sendUpdate();

        Object.keys(this.sockets).forEach(playerID => {
            const socket = this.sockets[playerID];
            socket.emit(Constants.MSG_TYPES.GOAL, res);
        });

        setTimeout(() => {
            console.log("Goal!");
        }, 2000)

    }

    createUpdate() {
        return {
            t: Date.now(),
            ball: this.ball,
            players: Object.values(this.players).map(player => {
                return {
                    x: player.x,
                    y: player.y,
                    socket: player.socket,
                    team: player.team,
                };
            }),
        };
    }

    addPlayer(socket, nickname) {
        this.players_count++;
        const team = this.players_count % 2;
        const team_name = (team === true) ? ('BLUE'.blue) : ('RED '.red);
        (team === true) ? (this.BLUE_players_count++) : (this.RED_players_count++);
        this.sockets[socket.id] = socket;

        // Generate a position to start this player at.
        const x = Constants.PITCH.FULL_X / 3 + Constants.PITCH.FULL_X / 3 * (!team);
        const y = Constants.PITCH.FULL_Y / 5 * ((team === true) ? ((this.BLUE_players_count % 3) + 2) : ((this.RED_players_count % 3) + 2));
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
        if (this.players.hasOwnProperty(`${socket.id}`))
            this.players[socket.id].direction = dir;
    }

    HandleSpaceKey(socket, res) {
        if (this.players.hasOwnProperty(`${socket.id}`))
            this.players[socket.id].gravity = res;
    }

    handleLMBClick(socket, res) {
        if (this.players.hasOwnProperty(`${socket.id}`))
            this.players[socket.id].push = res ** 2;
    }

    handleRMBClick(socket, res) {
        if (this.players.hasOwnProperty(`${socket.id}`))
            this.players[socket.id].assist = true;
    }

}


module.exports = Game;