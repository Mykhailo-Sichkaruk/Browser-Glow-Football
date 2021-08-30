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
        console.log(team_name + ':    ' + nickname + ':  connected:    on socket: ( ' + socket.id + ' )     ' + this.ball.x + ' ' + this.ball.y);

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
        this.ball.move(dt);
        //Move all players
        Object.values(this.players).forEach(function(player) {
            player.move(dt);
        });
    }

    colision() {
        let i = 0;

        for (let socket in this.players) {
            if (this.IsBallTouch(socket)) {
                this.PlayerBall(socket);
            }

            this.PlayerPlayerColision(socket, i);

            i++;
        }
    }

    PlayerBall(player) {
        let PowerVector = Math.atan2(this.ball.x - this.players[player].x, this.ball.y - this.players[player].y);
        this.ball.direction = (this.ball.direction + PowerVector) / 2;
        this.ball.velosity = ((this.players[player].mass - this.ball.mass) * this.players[player].velosity + 2 * this.ball.mass) / (this.players[player].mass + this.ball.mass) * 2;
    }

    IsBallTouch(player) {
        let current_distance = (this.ball.x - this.players[player].x) ** 2 + (this.ball.y - this.players[player].y) ** 2;

        if (current_distance <= this.PlayerBall_ColisonDistance)
            return true;
        else
            return false;
    }

    PlayerPlayerColision(player, me_index) {
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

    createUpdate() {

        return {
            t: Date.now(),
            ball: this.ball,
            players: Object.values(this.players),
        };
    }

    removePlayer(socket) {
        this.players_count--;
        delete this.sockets[socket.id];
        delete this.players[socket.id];
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
        this.players[socket.id].direction = dir;
    }



}


module.exports = Game;