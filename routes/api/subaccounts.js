const express = require("express");
const Crypto = require("../../controller/crypto");
const jwt = require('jsonwebtoken');
const router = express.Router();
const tokenSecretKey = require("../../config/config").tokenSecretKey;
const tokenExpireTime = require("../../config/config").tokenExpireTime;
const authService = require("../service/authService");
// Sub Account Model
const Subaccount = require("../../models/Subaccount");

//Register New Sub Account
router.post("/register", authService.verifyTokenExistance, (req, res) => {
	const err = authService.verifyToken(req.token);
    if(err) {
        res.sendStatus(403);
    } else {
        var password = Crypto.encrypt(req.body.password);
		let newSubaccount = new Subaccount({
			merchantId: req.body.merchantId,
			subAcctId: req.body.subAcctId,
			websiteUrl: req.body.websiteUrl,
			name: req.body.name,
			affUrl: req.body.affUrl,
			loginUrl: req.body.loginUrl,
			username: req.body.username,
			password: password,
			cronSched: req.body.cronSched
		});
		Subaccount.addSubaccount(newSubaccount, (err, subaccount) => {
			if (err) {
				return res.json({ success: false, msg: err });
			} else {
				return res.json({ success: true, msg: "New sub account is registered successfully." });
			}
		});
    }
});

router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		if (typeof password !== "string") {
			return res.json({
				success: false,
				errors: [
					{
						title: "Bad Request",
						message: "Password must be a string"
					}
				]
			});
		}
		//queries database to find a user with the received username
		const user = await Subaccount.findOne({ username });
		if (!user) {
			throw new Error("You are not registered.");
		}
		var decryptedPass = Crypto.decrypt(user.password);
		
		if (password!=decryptedPass) {
			throw new Error("Please check your password.");
		}
		jwt.sign({user: user}, tokenSecretKey, {expiresIn: tokenExpireTime}, (err, token) => {
			res.json({
				token: token,
				success: true,
				title: "Login Successful",
				message: "Welcome to Affiliate Dashboard."
			});
		});
		
	} catch (err) {
		res.json({
			success: false,
			errors: [
				{
					title: "Invalid Credentials",
					message: err.message
				}
			]
		});
	}
});

router.post("/reSchedule", authService.verifyTokenExistance, (req, res) => {
	const err = authService.verifyToken(req.token);
    if(err) {
        res.sendStatus(403);
    } else {
        let schedule = {
			accountId: req.body.accountId,
			cronSched: req.body.newCronSched
		};
		Subaccount.reSchedule(schedule, (err, subaccount) => {
			if (err) {
				return res.json({
					success: false,
					msg: "Can not change the cron schedule unexpectedly. Please try again later."
				});
			} else {
				return res.json({
					success: true,
					msg: "You changed cron schedule successfully.",
					newCronSched: subaccount.cronSched
				});
			}
		});
    }
});

router.get("/getAllSubAccounts", authService.verifyTokenExistance, (req, res) => {
	const err = authService.verifyToken(req.token);
    if(err) {
        res.sendStatus(403);
    } else {
        Subaccount.find()
		.sort({ subAcctId: -1 })
		.then(accounts => res.json(accounts));
    }
});

module.exports = router;
