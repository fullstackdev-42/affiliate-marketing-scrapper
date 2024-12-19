const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema

const PayoutSchema = new Schema({
	subAcctId: {
		type: String,
		required: true
	},
	amount: {
		type: Number
	},
	payoutMethod: {
		type: String
	},
	status: {
		type: String
	},
	payoutDate: {
		type: String
	},
	scrappedDate: {
		type: String
	},
	verified: {
		type: Boolean,
		default: false
	}
});

const Payout = (module.exports = mongoose.model("Payout", PayoutSchema));

module.exports.addPayout = function(newPayout) {
	var data = new Payout({
		subAcctId: newPayout.subAcctId,
		amount: newPayout.amount,
		payoutMethod: newPayout.payoutMethod,
		status: newPayout.status,
		payoutDate: newPayout.payoutDate,
		scrappedDate: newPayout.scrappedDate
	});
	data.save();
};

module.exports.getPayouts = function(subAcctId, callback) {
	Payout.find({ subAcctId: subAcctId })
		.sort({ _id: -1 })
		.exec(callback);
};

module.exports.deletePayouts = function() {
	Payout.remove({}).exec();
	console.log("Payouts connection dropped successfully.");
};
