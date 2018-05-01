let express = require('express');
let router = express.Router();

/* GET coins listing. */
router.get('/', getAllCoins);
router.get('/:currencyPair', coinSnapList);
router.get('/:currencyPair/:snapId', coinSnapDetails);

function coinSnapDetails(req, res, next) {
	const sqlite3 = require('sqlite3').verbose();
	const DB_PATH = 'coinsnapshot.db';

	// access the database - create db object
	let db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
		if (err)
			console.error(err.message);

		console.log('Connected to the Database.');
	});

	const coin = req.params.currencyPair;
	const snapId = req.params.snapId;
	const sql = `SELECT *
	 			FROM ${coin}
	 			WHERE ID=${snapId}`;

	db.all(sql, [], (err, details) => {
		if (err)
			return next(err);

		res.render('SnapshotDetail',{ details: details[0] });
		console.log('Passed data to \'SnapshotDetail\' view');
	});

	db.close((err) => {
		if (err)
			console.error(err.message);

		console.log('Closed the Database.');
	});
}

function coinSnapList(req, res, next) {
	const sqlite3 = require('sqlite3').verbose();
	const DB_PATH = 'coinsnapshot.db';

	// access the database - create db object
	let db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
		if (err)
			console.error(err.message);

		console.log('Connected to the Database.');
	});

	const coin = req.params.currencyPair;
	const sql = `SELECT dateCreated
	 			FROM ${coin}
	 			ORDER BY ID`;

	db.all(sql, [], (err, snaps) => {
		if (err)
			return next(err);

		res.render('SnapshotIndex', {snaps: snaps, coin: coin, title: "Index of Snapshots"});
		console.log('Passed ' + snaps.length + ' snapshots to \'SnapshotIndex\' view');
	});

	db.close((err) => {
		if (err)
			console.error(err.message);

		console.log('Closed the Database.');
	});
}

function getAllCoins(req, res, next) {
	const sqlite3 = require('sqlite3').verbose();
	const DB_PATH = 'coinsnapshot.db';

	// access the database - create db object
	let db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
		if (err)
			console.error(err.message);

		console.log('Connected to the Database.');
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

		// render the list of all coins in the view 'CoinsIndex'
		res.render('CoinsIndex', {coins: coins, title: "Index of Coins"});
		console.log('Passed ' + coins.length + ' coins to \'CoinsIndex\' view');
	});

	db.close((err) => {
		if (err)
			console.error(err.message);

		console.log('Closed the Database.');
	});
}

module.exports = router;
