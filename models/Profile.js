const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema

const ProfileSchema = new Schema({
    displayName: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

const Profile = module.exports = mongoose.model('Profile', ProfileSchema);

module.exports.getProfileById = function(id, callback){
    Profile.findById(id, callback);
}

module.exports.addProfile = function(newProfile, callback){
    newProfile.save(callback);
}

module.exports.edit = function(profile, callback) {
	Profile.findOneAndUpdate(
		{ _id: profile.profileId },
        { displayName: profile.displayName, url: profile.url },
		{ new: true },
		callback
	);
};