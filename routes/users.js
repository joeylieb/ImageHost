const express = require('express');
const router = express.Router();
const authCheck = require("../middleware/authCheck");
const domainModel = require("../schema/domain");
const userModel = require("../schema/user");
const isAdmin = require("../util/isKeyAdmin");

/* GET users listing. */
router.get('/@me', authCheck, function(req, res, next) {
    return res.status(200).json({status: 200, d: req.user});
});

router.post("/@me/domain/edit", authCheck, async (req, res) => {
    const newDomain = req.body.domain;

    if(!newDomain) res.status(400).json({status: 400, error: "Bad Request, include domain"});

    const domainResult = await domainModel.findOne({name: req.params.name});

    if(!domainResult) return res.status(401).json({status: 401, error: "Domain does not exist"});
    const updateQ = await userModel.updateOne({id: req.user.id}, {$set: {"selectedDomain": newDomain}});
    console.log(updateQ)
    if(updateQ){
        return res.status(200).json({status: 200, d: {success: true}});
    }

    return res.status(500).json({status: 500, error: "Internal Server Error"});
});


router.get("/isAdmin", authCheck, (req, res) => {
    if(isAdmin(req.user.apiKey)) return res.status(200).json({status: 200, d: {result: true}});

    return res.status(200).json({status: 200, d: {result: false}});
})

module.exports = router;
