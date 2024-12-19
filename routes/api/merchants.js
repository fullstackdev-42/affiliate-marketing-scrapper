const express = require('express');
const router = express.Router();
const authService = require("../service/authService");
// Merchant Model
const Merchant = require('../../models/Merchant');

//Register New Merchant
router.post('/register', authService.verifyTokenExistance, (req, res) => {
    const err = authService.verifyToken(req.token);
    if(err) {
        res.sendStatus(403);
    } else {
        let newMerchant = new Merchant({
            name: req.body.name
        });
        Merchant.addMerchant(newMerchant, (err, merchant) => {
            if(err){
                return res.json({success: false, msg: 'This merchant is already registered.'});
            } else {
                return res.json({success: true, msg: 'New merchant is registered successfully.'});
            }
        })
    }
});

router.get('/getAllMerchants', authService.verifyTokenExistance, (req, res) => {
    const err = authService.verifyToken(req.token);
    if(err) {
        res.sendStatus(403);
    } else {
        Merchant.find().sort({name: -1}).then(merchants => res.json(merchants));
    }    
})

module.exports = router;