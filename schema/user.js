const {Schema} = require("mongoose");
const mongoose = require("mongoose");

const user = new Schema({
    id: String,
    username: String,
    apiKey: String,
    uploads: Number
});

const userModel = mongoose.model("user", user);

module.exports = userModel;
