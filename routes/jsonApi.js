let express = require('express');
let router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const DB_PATH = 'RelationalSnapshot.db';
let counter = 0;

/* GET /api endpoint */
router.get('/', coinsIndex);
router.get('/:currencyPair', snapshotIndex);
router.get('/:currencyPair/:snapId', snapshotDetails);

function snapshotDetails(req, res, next) {
	let db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
		if (err)
			console.error(err.message);
	});

	const coin = req.params.currencyPair;
	const snapId = req.params.snapId;
	const sql = `SELECT *
	 			FROM ${coin}
	 			WHERE ID=${snapId}`;

	db.all(sql, [], (err, details) => {
		if (err)
			return next(err);

		res.json({details: details[0]});
		console.log(`Passed detailed snapshot #${snapId} for ${coin}`);
	});

	db.close((err) => {
		if (err)
			console.error(err.message);
	});
}

function snapshotIndex(req, res, next) {
	let db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
		if (err)
			console.error(err.message);
	});

	const coin = req.params.currencyPair;
	const sql = `SELECT dateCreated, ID
	 			FROM ${coin}
	 			ORDER BY ID`;

	db.all(sql, [], (err, snaps) => {
		if (err)
			return next(err);

		res.json({snaps});
		console.log(`Passed back JSON array of ${snaps.length} snapshots for ${coin.name}`);
	});

	db.close((err) => {
		if (err)
			console.error(err.message);
	});
}

function coinsIndex(req, res, next) {
	let db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
		if (err)
			console.error(err.message);

		console.log(` [${++counter}]\tJSON API <=> Database @ ${new Date().toUTCString()}`);
	});

	// acquire list of all coins
	const sql = `SELECT symbol_safe, symbol_full, name
			 FROM _all_your_coin
			 ORDER BY symbol_safe`;
	db.all(sql, [], (err, coins) => {
		if (err)
			return next(err);

		// return JSON array of all coins
		res.json(coins);
		console.log(`Returned JSON object of ${coins.length} coin(s)`);
	});

	db.close((err) => {
		if (err)
			console.error(err.message);
	});
}

module.exports = router;