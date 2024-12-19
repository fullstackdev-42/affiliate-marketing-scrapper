const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema

const SubaccountSchema = new Schema({
	merchantId: {
		type: String,
		required: true
	},
	subAcctId: {
		type: String,
		required: true
	},
	websiteUrl: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	affUrl: {
		type: String,
		required: true
	},
	loginUrl: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	cronSched: {
		type: String,
		required: true
	}
});

const Subaccount = (module.exports = mongoose.model("Subaccount", SubaccountSchema));

module.exports.addSubaccount = function(newSubaccount, callback) {
	newSubaccount.save(callback);
};

module.exports.checkSubaccountName = function(requestedSubaccount, callback) {
	Subaccount.findOne({ username: requestedSubaccount.username }, callback);
};

module.exports.checkSubaccount = function(requestedSubaccount, callback) {
	Subaccount.findOne({ username: requestedSubaccount.username, password: requestedSubaccount.password }, callback);
};

module.exports.reSchedule = function(schedule, callback) {
	Subaccount.findOneAndUpdate(
		{ _id: schedule.accountId },
		{ cronSched: schedule.cronSched },
		{ new: true },
		callback
	);
};
module.exports.getSubAccounts = function(callback) {
	Subaccount.find()
		.sort({ _id: -1 })
		.exec(callback);
};
module.exports.changePassword = function(user, callback){
	console.log(user);
	Subaccount.findOneAndUpdate(
		{ _id: user.accountId },
		{ password: user.password },
		{ new: true },
		callback
	);
}
