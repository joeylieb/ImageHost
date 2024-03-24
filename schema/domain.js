const {Schema} = require("mongoose");
const mongoose = require("mongoose");

const domain = new Schema({
    url: String,
    createdBy: String,
    usedBy: [String],
    dateAdded: String,
    id: String
});

const domainModel = mongoose.model("domain", domain);

module.exports = domainModel;
