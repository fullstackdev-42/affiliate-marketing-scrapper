const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema

const StatisticSchema = new Schema({
	subAcctId: {
		type: String,
		required: true
	},
	unpaidReferrals: {
		type: String
	},
	paidReferrals: {
		type: String
	},
	visits: {
		type: String
	},
	convRate: {
		type: String
	},
	unpaidEarnings: {
		type: Number
	},
	paidEarnings: {
		type: Number
	},
	commissionRate: {
		type: String
	},
	statisticsTable: {
		type: []
	},
	scrappedDate: {
		type: String
	}
});

const Statistic = (module.exports = mongoose.model("Statistic", StatisticSchema));

module.exports.addStatistics = function(data, callback) {
	Statistic.findOne(
		{
			subAcctId: data.subAcctId,
			unpaidReferrals: data.unpaidReferrals,
			paidReferrals: data.paidReferrals,
			visits: data.visits,
			convRate: data.convRate,
			unpaidEarnings: data.unpaidEarnings,
			paidEarnings: data.paidEarnings,
			commissionRate: data.commissionRate,
			statisticsTable: data.statisticsTable
		},
		function(err, record) {
			if (!record) {
				data.save(callback);
			} else {
				console.log("Statistics not update for " + data.subAcctId);
			}
		}
	);
};
module.exports.getStatistics = function(subAcctId, callback) {
	Statistic.find({ subAcctId: subAcctId })
		.sort({ _id: -1 })
		.exec(callback);
};
module.exports.deleteStatistics = function() {
	Statistic.remove({}).exec();
	console.log("Statistics connection dropped successfully.");
};
