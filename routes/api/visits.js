const express = require("express");
const router = express.Router();
const authService = require("../service/authService");

// Visit Model
const Visit = require("../../models/Visit");

router.post("/getVisits", authService.verifyTokenExistance, (req, res, next) => {
	const err = authService.verifyToken(req.token);
    if(err) {
        res.sendStatus(403);
    } else {
        let subAcctId = req.body.subAcctId;
		Visit.getVisits(subAcctId, (err, visits) => {
			if (err) {
				return res.json({
                    success: false,
                    msg: "Something went wrong. Please refresh the page."
                });
			} else {
				return res.json({ success: true, visits: visits });
			}
		});
    }
	
});
module.exports = router;
