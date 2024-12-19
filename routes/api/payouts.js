const express = require("express");
const router = express.Router();
const authService = require("../service/authService");

// Payout Model
const Payout = require("../../models/Payout");

router.post("/getPayouts", authService.verifyTokenExistance, (req, res) => {
	const err = authService.verifyToken(req.token);
    if(err) {
        res.sendStatus(403);
    } else {
        let subAcctId = req.body.subAcctId;
		Payout.getPayouts(subAcctId, (err, payouts) => {
			if (err) {
				return res.json({
                    success: false,
                    msg: "Something went wrong. Please refresh the page."
                });
			} else {
				return res.json({ success: true, payouts: payouts });
			}
		});
    }	
});
module.exports = router;
