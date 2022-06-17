class Team {
	constructor(name) {
		this.name = name;
		this.score = 0;
		this.playersCount = 0;
	}
    
	addPlayer() {
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

}

module.exports = Team;