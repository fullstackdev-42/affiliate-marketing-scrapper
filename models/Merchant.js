const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema

const MerchantSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

const Merchant = module.exports = mongoose.model('Merchant', MerchantSchema);

module.exports.getMerchantById = function(id, callback){
    Merchant.findById(id, callback);
}

module.exports.getMerchantByName = function(name, callback){
    const query = {name: name}
    Merchant.findOne(query, callback);
}

module.exports.addMerchant = function(newMerchant, callback){
    newMerchant.save(callback);
}