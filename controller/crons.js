var CronJob = require('cron').CronJob;
const Subaccount = require("../models/Subaccount");
const Statistic = require("../models/Statistic");
const Referral = require("../models/Referral");
const Visit = require("../models/Visit");
const Payout = require("../models/Payout");
const Scrapper = require("./scrapper");
const Crypto = require("../controller/crypto");

function  Cron(account) {
	this.account = account;
	var that = this;
	this.run = function() {
		new CronJob(that.account.cronSched, function() {
			Scrapper.doScrape(that.account);
		}, null, true, 'America/Los_Angeles');
	}
}

async function getAllSubAccounts(){
	Subaccount.getSubAccounts(async (err, accounts) => {

		if (err) {
			console.log("Can't get sub accounts to scrap.");
		} else {
			//Scrapper.doScrape(accounts[0]);
			// for(var i = 0 ; i < accounts.length ; i ++){
			// 	// var result = 0;
			// 	// result = await Scrapper.doScrape(accounts[i]);
			// 	// if(result == 1){
			// 	// 	console.log((i + 1) + 'done');
			// 	// 	continue;
			// 	// }
			// 	var myCron = new Cron(accounts[i]);
			// 	myCron.run();				
			// }
		}
	});
};

module.exports.prepareCron = function() {
	// Statistic.deleteStatistics();
	// Referral.deleteReferrals();
	// Visit.deleteVisits();
	// Payout.deletePayouts();
	getAllSubAccounts();
};
