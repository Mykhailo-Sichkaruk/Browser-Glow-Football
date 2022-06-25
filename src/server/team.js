class Team {
	constructor(name) {
		this.name = name;
		this.score = 0;
		this.playersCount = 0;
		this.goalkeeper = null;
		this.midfielder = null;
		this.forward = null;
	}

	incrementPlayers() {
		this.playersCount++;
	}

	removePlayer() {
		this.playersCount--;
	}

	addScore() {
		this.score++;
	}

	removeScore() {
		this.score = 0;
	}

	getScore() {
		return this.score;
	}

	getPlayersCount() {
		return this.playersCount;
	}

	setGoalkeeper(player) {
		this.goalkeeper = player;
	}

	setMidfielder(player) {
		this.midfielder = player;
	}

	setForward(player) {
		this.forward = player;
	}

	getGoalkeeper() {
		return this.goalkeeper;
	}

	getMidfielder() {
		return this.midfielder;
	}

	getForward() {
		return this.forward;
	}

}

export default Team;
