let express = require('express');
let router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const DB_PATH = 'RelationalSnapshot.db';
let counter = 0;

/* GET /web endpoint */
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
        		FROM _all_your_coin
	 			NATURAL JOIN ${coin}
	 			WHERE ID=${snapId}`;

	db.all(sql, [], (err, details) => {
		if (err)
			return next(err);

		res.render('SnapshotDetail',{details: details[0]});
		console.log(`Passed detailed snapshot #${snapId} for ${coin} to 'SnapshotDetail' view`);
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
	const sql = `SELECT ID, dateCreated, name
	 			FROM _all_your_coin
	 			NATURAL JOIN ${coin}
	 			ORDER BY ID`;

	db.all(sql, [], (err, snaps) => {
		if (err)
			return next(err);

		res.render('SnapshotIndex', {
			coinName: snaps[0].name, symbolSafe: coin, snapshots: snaps.map(snap => [snap.ID, snap.dateCreated])});
		console.log(`Passed ${snaps.length} snapshots for ${coin} to 'SnapshotIndex' view`);
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

		console.log(` [${++counter}]\tWeb <=> Database @ ${new Date().toUTCString()}`);
	});

	// acquire list of table names (coins)
	const sql = `SELECT symbol_safe, symbol_full, name
			 FROM _all_your_coin
			 ORDER BY symbol_safe`;
	db.all(sql, [], (err, coins) => {
		if (err)
			return next(err);

		// render the list of all coins in the view 'CoinsIndex'
		res.render('CoinsIndex', {coins: coins, title: "Index of Coins"});
		console.log(`Passed ${coins.length} coins to 'CoinsIndex' view`);
	});

	db.close((err) => {
		if (err)
			console.error(err.message);
	});
}

module.exports = router;