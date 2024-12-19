const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema

const VisitSchema = new Schema({
	subAcctId: {
		type: String,
		required: true
	},
	url: {
		type: String
	},
	href: {
		type: String
	},
	referUrl: {
		type: String
	},
	convStatus: {
		type: Boolean
	},
	visitDate: {
		type: String
	},
	scrappedDate: {
		type: String
	}
});

const Visit = (module.exports = mongoose.model("Visit", VisitSchema));

module.exports.addVisit = function(newVisit) {
	var data = new Visit({
		subAcctId: newVisit.subAcctId,
		url: newVisit.url,
		href: newVisit.href,
		referUrl: newVisit.referUrl,
		convStatus: newVisit.convStatus,
		visitDate: newVisit.visitDate,
		scrappedDate: newVisit.scrappedDate
	});
	data.save();
};

module.exports.getVisits = function(subAcctId, callback) {
	Visit.find({ subAcctId: subAcctId })
		.sort({ _id: -1 })
		.exec(callback);
};

module.exports.deleteVisits = function() {
	Visit.remove({}).exec();
	console.log("Visits connection dropped successfully.");
};
