const jwt = require('jsonwebtoken');
const tokenSecretKey = require("../../config/config").tokenSecretKey;
module.exports.verifyTokenExistance = function(req, res, next) {
	//Get auth header value
	const bearerHeader = req.headers['authorization'];
	if(typeof bearerHeader !== 'undefined') {
		//Split at the space
		const bearer = bearerHeader.split(' ');
		// Get token from array
		const bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	} else {
		//Forbidden
		res.sendStatus(403);
	}
};
module.exports.verifyToken = function(token) {
	var error;
    jwt.verify(token, tokenSecretKey, (err, authData) => {
		error = err;
	});
	return error;
}