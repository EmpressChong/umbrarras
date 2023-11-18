let { nest } = require('../tiles/misc.js'),
room = Array(15).fill(() => Array(15).fill()).map(x => x());

for (let x = 6; x <= 8; x++) {
	for (let y = 6; y <= 8; y++) {
		room[y][x] = nest;
	}
}

module.exports = room;