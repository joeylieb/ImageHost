const express = require("express");
const router = express.Router();
const userModel = require("../schema/user");

router.post("/login", async (req, res) => {
    console.log(req.body)
    if(!req.body.key) return res.status(400).json({status: 400, error: "No Key Provided"})

    const userData = await userModel.findOne({apiKey: req.body.key});

    if(!userData) return res.status(401).json({status: 401, error: "User does not exist"});


    return res.status(200).json({status: 200, d: userData})
});

module.exports = router;
