const express = require("express");
const router = express.Router();
const authService = require("../service/authService");

// Statistics Model
const Statistic = require("../../models/Statistic");

router.post("/getStatistics", authService.verifyTokenExistance, (req, res) => {
	const err = authService.verifyToken(req.token);
    if(err) {
        res.sendStatus(403);
    } else {
        let subAcctId = req.body.subAcctId;
		Statistic.getStatistics(subAcctId, (err, statistic) => {
			if (err) {
				return res.json({ success: false });
			} else {
				return res.json({ success: true, statistic: statistic });
			}
		});
    }
});
module.exports = router;
