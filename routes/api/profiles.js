const express = require('express');
const router = express.Router();
const authService = require("../service/authService");
// Profile Model
const Profile = require('../../models/Profile');

//Register New Profile
router.post('/register', authService.verifyTokenExistance, (req, res) => {
    const err = authService.verifyToken(req.token);
    if(err) {
        res.sendStatus(403);
    } else {
        let newProfile = new Profile({
            displayName: req.body.displayName,
            url: req.body.url
        });
        Profile.addProfile(newProfile, (err, Profile) => {
            if(err){
                return res.json({success: false});
            } else {
                return res.json({success: true, msg: 'New profile is registered successfully.'});
            }
        })
    }    
});

router.post("/edit", authService.verifyTokenExistance, (req, res) => {
    const err = authService.verifyToken(req.token);
    if(err) {
        res.sendStatus(403);
    } else {
        let profile = {
            profileId: req.body.profileId,
            displayName: req.body.displayName,
            url: req.body.url
        };
        Profile.edit(profile, (err, newProfile) => {
            if (err) {
                return res.json({
                    success: false,
                    msg: "Can not save this profile unexpectedly. Please try again later."
                });
            } else {
                return res.json({
                    success: true,
                    msg: "You saved profile successfully.",
                    displayName: newProfile.displayName,
                    url: newProfile.url
                });
            }
        });
    }
});

router.get('/getAllProfiles', authService.verifyTokenExistance, (req, res) => {
    const err = authService.verifyToken(req.token);
    if(err) {
        res.sendStatus(403);
    } else {
        Profile.find().sort({name: -1}).then(profiles => res.json(profiles));
    }
    
})

module.exports = router;                                    