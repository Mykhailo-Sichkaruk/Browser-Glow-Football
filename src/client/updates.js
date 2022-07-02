
const updates = [];


function addUpdate(update) {
	updates.push(update);
	return;
}
// 	if (updates.length === 0) {
// 		updates.push(update);
// 		return;
// 	}

// 	const interpolatedUpdate = {
// 		ball: {
// 			x: Math.floor((updates[ updates.length - 1 ].ball.x + update.ball.x) / 2),
// 			y: Math.floor((updates[ updates.length - 1 ].ball.y + update.ball.y) / 2),
// 		},
// 		players: {},
// 	};

// 	for (const player in update.players) {
// 		if (Object.prototype.hasOwnProperty.call(updates[ updates.length - 1 ].players, player)) {
// 			interpolatedUpdate.players[ player ] = {
// 				x: Math.floor((updates[ updates.length - 1 ].players[ player ].x + update.players[ player ].x) / 2),
// 				y: Math.floor((updates[ updates.length - 1 ].players[ player ].y + update.players[ player ].y) / 2),
// 				team: updates[ updates.length - 1 ].players[ player ].team,
// 			};
// 		}
// 	}

// 	updates.push(interpolatedUpdate);
// 	updates.push(update);
// }

function getUpdate() {
	if (updates.length > 1) {
		return updates.shift();
	} else if (updates.length === 0) {
		return null;
	} else {
		return updates[0];
	}

}


export { addUpdate, getUpdate };
