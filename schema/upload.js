const {Schema} = require("mongoose");
const mongoose = require("mongoose");

const upload = new Schema({
    fileExtension: String,
    id: String,
    dateCreated: String,
    userUploaded: {
        id: String,
        username: String
    },
    fileName: String,
    fileType: String
});

const uploadModel = mongoose.model("upload", upload);

module.exports = uploadModel;
