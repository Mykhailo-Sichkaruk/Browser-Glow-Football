const {GAME} = require("../shared/constants");

class Performance {
	constructor () {
		this.ping = {
			count: 0,
			sum: 0,
			max: 0,
			avg: 0,
			peakCount: 0,
		};
	}

	addPing(newPing) {
		this.ping.count++;
		this.ping.sum += newPing;
		if (newPing > this.ping.max) {
			this.ping.max = newPing;
		}
		if (this.ping.count > 1000 / GAME.SERVER_PING * 60) {
			this.ping.avg = this.ping.sum / this.ping.count;
			this.ping.count = 0;
			this.ping.sum = 0;
			console.log(`Averange Ping: ${this.ping.avg.toFixed(0)}ms`);
		}
	}
}

module.exports = Performance;