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
      userUploaded: {
         id: req.user.id,
         username: req.user.username
      },
      fileType: "images",
      fileName
   });

   await userModel.updateOne({id: req.user.id}, {$inc: {"uploads": 1}})

   return res.status(200).json({d: {url: `https://${req.user.selectedDomain.length > 1 ? req.user.selectedDomain : "cdn.israel.ps"}/${fileName}`, deleteURL: `https://cdn.israel.ps/${fileName}/delete`}});
});

router.get("/image", (req, res) => {
   return res.status(400).json("Method not Allowed")
})

router.get("/image/data", async (req, res) => {
   if (!req.query.fileName) return res.status(400).json({status: 400, error: "Must provide file name"});
   const uploadedImage = await uploadModel.findOne({fileName: req.query.fileName});
   
   if(!uploadedImage.userUploaded.id) return res.status(500).json({status: 500, error: "Could not find user/file"});

   const userData = await userModel.findOne({id: uploadedImage.userUploaded.id});
   if(!userData) return res.status(404).json({status: 404, error: "Could not find user"});

   let imageData = {
      embedData: {
         title: "My Uploaded Image",
         description: "I uploaded this with Joey's image host",
         color: "#0b8bdb"
      },
      user: userData.username,
      timeCreated: uploadedImage.dateCreated
   }

   if(userData.embedData) imageData.embedData = userData.embedData;

   return res.status(200).json({status: 200, d: imageData});
})

module.exports = router;
