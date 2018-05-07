let express = require('express');
let router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const DB_PATH = 'coinsnapshot.db';

/* GET coins listing. */
router.get('/', getAllCoins);
router.get('/:currencyPair', coinSnapList);
router.get('/:currencyPair/:snapId', coinSnapDetails);

function coinSnapDetails(req, res, next) {
	// access the database - create db object
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

		// db.all method passes an array - in this case there is only 1 member
		res.json({details: details[0]});
		console.log(`Passed back detailed snapshot #${snapId} for ${coin}`);
	});

	db.close((err) => {
		if (err)
			console.error(err.message);
	});
}

function coinSnapList(req, res, next) {
	// access the database - create db object
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
		console.log(`Passed back JSON array of ${snaps.length} snapshots`);
	});

	db.close((err) => {
		if (err)
			console.error(err.message);
	});
}

function getAllCoins(req, res, next) {
	// access the database - create db object
	let db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
		if (err)
			console.error(err.message);

		console.log('JSON API <-> Database @ ' + new Date.toUTCString());
	});

	// acquire list of table names (coins)
	const sql = `SELECT name
			 FROM sqlite_master
			 WHERE type='table'
			 AND name!='sqlite_sequence'
			 ORDER BY name`;
	db.all(sql, [], (err, coins) => {
		if (err)
			return next(err);

		let names = [];
		coins.forEach((coin) => { names.push(coin.name) });

		// return JSON array of all coins
		res.json({names});
		console.log(`Passed back JSON array of ${coins.length} coin(s)`);
	});

	db.close((err) => {
		if (err)
			console.error(err.message);
	});
}

module.exports = router;