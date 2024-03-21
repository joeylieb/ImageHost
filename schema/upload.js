const {Schema} = require("mongoose");
const mongoose = require("mongoose");

const upload = new Schema({
    fileExtension: String,
    id: String,
    dateCreated: String,
    userUploaded: String,
    fileName: String,
    fileType: String
});

const uploadModel = mongoose.model("upload", upload);

module.exports = uploadModel;
