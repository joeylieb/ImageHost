const express = require('express');
const router = express.Router();
const uploadModel = require("../schema/upload");
const userModel = require("../schema/user");
const {getServiceClient} = require("../util/blobService");
const {singularize} = require("../util/file");
const authCheck = require("../middleware/authCheck");

router.get("/:filename", async (req, res, next) => {
    try {
        if(!req.params.filename) {
            return res.sendStatus(404);
        }

        const uploadData = await uploadModel.findOne({fileName: req.params.filename});

        if(!uploadData) return res.sendStatus(404);

        const containerClient = getServiceClient().getContainerClient(uploadData.fileType);
        const blobClient = containerClient.getBlobClient(uploadData.fileName);
        const downloadResponse = await blobClient.download();

        res.set({
            "Content-Type": `${singularize(uploadData.fileType)}/${uploadData.fileExtension}`});

        downloadResponse.readableStreamBody.pipe(res);
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.delete("/:filename/delete", authCheck, async (req, res) => {
    if(!req.params.filename) {
        return res.status(400).json({status: 400, error: "You need to include a file ID"});
    }

    const uploadData = await uploadModel.findOne({fileName: req.params.filename});
    if(!uploadData) return res.status(404).json({status: 404, error: "File not found"});

    const containerClient = getServiceClient().getContainerClient(uploadData.fileType);
    const blobClient = containerClient.getBlobClient(uploadData.fileName);
    const downloadResponse = await blobClient.delete();

    if(downloadResponse.errorCode) return res.status(500).json({status: 500, error: "Internal server error"});

    await uploadModel.deleteOne({fileName: req.params.filename});
    await userModel.updateOne({id: req.user.id}, {$inc: {uploads: -1}});

    return res.status(200).json({status: 200, d: {success: true}})
});

router.get("/", (req, res) => {
   return res.send("This domain is being used for Joey585's image host located <a href='https://image.minelink.xyz'>here</a>")
});

module.exports = router;
