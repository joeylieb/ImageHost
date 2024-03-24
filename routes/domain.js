const express = require("express");
const router = express.Router();
const authMid = require("../middleware/authCheck");
const isAdmin = require("../util/isKeyAdmin");
const randomID = require("../util/randomID");
const domainModel = require("../schema/domain");

router.get("/list/all", async (req, res) => {
    let allDomains = [];

    for await (const domain of domainModel.find({})) {
        allDomains.push({url: domain.url, dateAdded: domain.dateAdded, id: domain.id})
    }

    return res.status(200).json({status: 200, d: allDomains});
});

router.post("/create/new", authMid, async (req, res) => {
    if(!isAdmin(req.user.apiKey)) return res.status(401).json({status: 401, error: "Not Authenticated"});

    console.log(req.body)

    if(!req.body.name || !req.body.createdBy) return res.status(400).json({status: 400, error: "Bad Request"})

    try {
        await domainModel.create({
            url: req.body.name,
            createdBy: req.body.createdBy,
            usedBy: [],
            dateAdded: Date.now().toString(),
            id: randomID(6)
        });

        return res.status(200).json({status: 200, d: {success: true}})
    } catch (e) {
        console.error(e)
        return res.status(500).json({status: 500, d: {success: false}});
    }
});

module.exports = router;

