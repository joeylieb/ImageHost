const express = require('express');
const router = express.Router();
const authCheck = require("../middleware/authCheck");
const domainModel = require("../schema/domain");
const userModel = require("../schema/user");
const isAdmin = require("../util/isKeyAdmin");
const uploadModel = require("../schema/upload");

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
});

router.get("/@me/uploads/get/:amount", authCheck, async (req, res) => {
    if(!req.params.amount) return res.status(400).json({status: 400, error: "Bad request, must include amount"});
    if(!parseInt(req.params.amount)) return res.status(400).json({status: 400, error: "Amount is not a number"});
    if(req.params.amount > 100) return res.status(400).json({status: 400, error: "Too big of a fetch"});
    console.log({username: req.user.username})
    const images = await uploadModel.find({userUploaded: req.user.username}).sort({dateCreated: 'descending'}).limit(req.params.amount);

    if(images){
        return res.status(200).json({status: 200, d: images});
    }

    return res.status(500).json({status: 500, error: "Internal Server Error"})
});

module.exports = router;
