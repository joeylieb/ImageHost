const express = require('express');
const router = express.Router();
const uploadModel = require("../schema/upload");
const {getServiceClient} = require("../util/blobService");
const {singularize} = require("../util/file");

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

        res.set({"Content-Type": `${singularize(uploadData.fileType)}/${uploadData.fileExtension}`});

        downloadResponse.readableStreamBody.pipe(res);
    } catch (e) {
        return res.sendStatus(500);
    }
});

router.get("/", (req, res) => {
   return res.send("israel.ps CDN")
});

module.exports = router;
