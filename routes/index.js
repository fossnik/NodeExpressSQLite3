let express = require('express');
let router = express.Router();

/* GET coins listing. */
router.get('/', getAllCoins);
router.get('/:currencyPair', coinSnapList);

function coinSnapList(req, res, next) {
	const sqlite3 = require('sqlite3').verbose();
	const DB_PATH = 'coinsnapshot.db';

	// access the database - create db object
	let db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
		if (err)
			console.error(err.message);

		console.log('Connected to the Database.');
	});

	const sql = `SELECT dateCreated
	 			FROM ${req.params.currencyPair}`;

	db.all(sql, [], (err, snaps) => {
		if (err)
			return next(err);

		res.render('SnapshotIndex', {snaps: snaps, title: "Index of Snapshots"});
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
	let sql = `SELECT name
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
