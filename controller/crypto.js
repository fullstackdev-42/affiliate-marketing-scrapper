var CryptoJS = require("crypto-js");
const cryptoKey = require("../config/config").cryptoKey;

module.exports.encrypt = function(plaintext){
    var ciphertext = CryptoJS.AES.encrypt(plaintext, cryptoKey).toString();
    return ciphertext;
}
module.exports.decrypt = function(ciphertext){
    var bytes  = CryptoJS.AES.decrypt(ciphertext, cryptoKey);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
}