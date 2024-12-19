const express = require('express');
const router = express.Router();
const authService = require("../service/authService");

// Merchant Model
// const Merchant = require('../../models/Merchant');

router.get('/getOverview', authService.verifyTokenExistance, (req, res) => {
    const err = authService.verifyToken(req.token);
    if(err) {
        res.sendStatus(403);
    } else {
        let data = {
            'realComm': 63385.44,
            'allComm': 65052.23,
            'disputedComm': 1666.79,
            'EPC': 0.79,
            'clicks': 96452,
            'sales': 2549,
            'AOV': 46.50,
            'commRate': 3.49
        }
        res.json(data);
    }
})
router.get('/getPersonalOverview', authService.verifyTokenExistance, (req, res) => {
    const err = authService.verifyToken(req.token);
    if(err) {
        res.sendStatus(403);
    } else {
        let data = [
            {
                'profileId': '',
                'profileName': 'BestVPNReview',
                'expand': false,
                'info': [{
                    'subAcctId': '',
                    'name': 'BestVPNReview',
                    'commNet': 8953.48,
                    'commGross': 9042.62,
                    'sales': 241,
                    'clicks': 1241,
                    'EPC': 2.14,
                    'commRate': 13.4
                }]            
            },
            {
                'profileId': '',
                'profileName': 'TopStreamingServices',
                'expand': false,
                'info': [{
                    'subAcctId': '',
                    'name': 'TopStreamingServices',
                    'commNet': 8953.48,
                    'commGross': 9042.62,
                    'sales': 241,
                    'clicks': 1241,
                    'EPC': 2.14,
                    'commRate': 13.4
                }]            
            },
            {
                'profileId': '',
                'profileName': 'BestElectronicReviews',
                'expand': false,
                'info': [
                    {
                        'subAcctId': '',
                        'name': 'MediaMeister',
                        'commNet': 605.04,
                        'commGross': 605.04,
                        'sales': 26,
                        'clicks': 484,
                        'EPC': 2.14,
                        'commRate': 13.4
                    },
                    {
                        'subAcctId': '',
                        'name': 'Social Empire',
                        'commNet': 3251.52,
                        'commGross': 3342.01,
                        'sales': 105,
                        'clicks': 420,
                        'EPC': 2.14,
                        'commRate': 13.4
                    },
                    {
                        'subAcctId': '',
                        'name': 'Audience Gain',
                        'commNet': 2180.06,
                        'commGross': 2180.06,
                        'sales': 96,
                        'clicks': 622,
                        'EPC': 2.14,
                        'commRate': 13.4
                    }
                ]
            },        
            {
                'profileId': '',
                'profileName': 'NebulousReviewClub',
                'expand': false,
                'info': [{
                    'subAcctId': '',
                    'name': 'NebulousReviewClub',
                    'commNet': 8953.48,
                    'commGross': 9042.62,
                    'sales': 241,
                    'clicks': 1241,
                    'EPC': 2.14,
                    'commRate': 13.4
                }]
            },
            {
                'profileId': '',
                'profileName': 'RetailReviews',
                'expand': false,
                'info': [{
                    'subAcctId': '',
                    'name': 'RetailReviews',
                    'commNet': 8953.48,
                    'commGross': 9042.62,
                    'sales': 241,
                    'clicks': 1241,
                    'EPC': 2.14,
                    'commRate': 13.4
                }]
            },
            {
                'profileId': '',
                'profileName': 'VPNReviewHub',
                'expand': false,
                'info': [{
                    'subAcctId': '',
                    'name': 'VPNReviewHub',
                    'commNet': 8953.48,
                    'commGross': 9042.62,
                    'sales': 241,
                    'clicks': 1241,
                    'EPC': 2.14,
                    'commRate': 13.4
                }]
            },
            {
                'profileId': '',
                'profileName': 'ViewReviews',
                'expand': false,
                'info': [{
                    'subAcctId': '',
                    'name': 'ViewReviews',
                    'commNet': 8953.48,
                    'commGross': 9042.62,
                    'sales': 241,
                    'clicks': 1241,
                    'EPC': 2.14,
                    'commRate': 13.4
                }]
            },
            {
                'profileId': '',
                'profileName': 'BuyViewsReview',
                'expand': false,
                'info': [{
                    'subAcctId': '',
                    'name': 'BuyViewsReview',
                    'commNet': 8953.48,
                    'commGross': 9042.62,
                    'sales': 241,
                    'clicks': 1241,
                    'EPC': 2.14,
                    'commRate': 13.4
                }]
            }
        ]
        res.json(data);
    }    
})
module.exports = router;