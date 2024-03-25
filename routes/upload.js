const express = require('express');
const router = express.Router();
const uploadMid = require("../middleware/fileProc");
const authMid = require("../middleware/authCheck");
const {getServiceClient} = require("../util/blobService");
const {generateRandomID, extractFileType} = require("../util/file");
const uploadModel = require("../schema/upload");
const userModel = require("../schema/user");
require("dotenv").config();


router.post("/image", uploadMid, authMid, async (req, res, next) => {
   console.log("ran")
   const fileData = req.file
   const fileID = generateRandomID(6)
   const fileName = `${fileID}.${extractFileType(fileData.originalname)}`;

   const containerClient = getServiceClient().getContainerClient("images")
   const blobClient = containerClient.getBlockBlobClient(fileName);

   await blobClient.uploadData(fileData.buffer, {
      blobHTTPHeaders: {
         blobContentType: `image/${extractFileType(fileData.originalname)}`
      },
      metadata: {
         user: req.user.username,
         dateCreated: (Math.round(Date.now() / 1000)).toString(),
         userID: req.user.id
      }
   });

   await uploadModel.create({
      fileExtension: extractFileType(fileData.originalname),
      id: fileID,
      dateCreated: Math.round(Date.now() / 1000),
      userUploaded: req.user.username,
      fileType: "images",
      fileName
   });

   await userModel.updateOne({id: req.user.id}, {$inc: {"uploads": 1}})

   return res.status(200).json({d: {url: `https://${req.user.selectedDomain.length > 1 ? req.user.selectedDomain : "cdn.israel.ps"}/${fileName}`}});
});

router.get("/image", (req, res) => {
   return res.sendStatus(400).send("Method not Allowed")
})

module.exports = router;
