let express = require('express');
let router = express.Router();

/* GET coins listing. */
router.get('/', getAllCoins);

function getAllCoins(req, res, next) {
	const sqlite3 = require('sqlite3').verbose();
	const DB_PATH = 'coinsnapshot.db';

	// access the database - create db object
	let db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
		if (err)
			console.error(err.message);

		console.log('Connected to the CoinDB Database.');
	});

	// acquire list of table names (coins)
	let sql = `SELECT name
			 FROM sqlite_master
			 WHERE type='table'
			 ORDER BY name`;
	db.all(sql, [], (err, rows) => {
		if (err)
			return next(err);

		res.render('CoinsIndex', {rows: rows, title: "Index of Coins"});
	});

	db.close((err) => {
		if (err)
			console.error(err.message);

		console.log('Closed the CoinDB Database.');
	});
}

module.exports = router;
