const express = require("express");
const router = express.Router();
const authService = require("../service/authService");

// Referral Model
const Referral = require("../../models/Referral");

router.post("/getReferrals", authService.verifyTokenExistance, (req, res) => {
	const err = authService.verifyToken(req.token);
    if(err) {
        res.sendStatus(403);
    } else {
        let subAcctId = req.body.subAcctId;
		Referral.getReferrals(subAcctId, (err, referrals) => {
			if (err) {
				return res.json({
                    success: false,
                    msg: "Something went wrong. Please refresh the page."
                });
			} else {
                return res.json({ success: true, referrals: referrals });
			}
		});
    }	
});
module.exports = router;
