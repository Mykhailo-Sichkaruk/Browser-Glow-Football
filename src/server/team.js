class Team {
	/**
	 * Team class constructor
	 * @param {boolean} name - ***true*** for blue team, ***false*** for red team
	 */
	constructor(name) {
		this.name = name;
		this.score = 0;
		this.playersCount = 0;
	}

	incrementPlayersCount() {
		this.playersCount++;
	}

	removePlayer() {
		this.playersCount--;
	}

	incrementScore() {
		this.score++;
	}

	resetScore() {
		this.score = 0;
	}

	getScore() {
		return this.score;
	}

	getPlayersCount() {
		return this.playersCount;
	}

}

export default Team;
