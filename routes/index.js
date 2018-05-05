let express = require('express');
let router = express.Router();

/* GET index - Redirect. */
router.get('/', function (req, res) {
	res.redirect("/web");
});

module.exports = router;