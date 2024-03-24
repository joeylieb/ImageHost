require("dotenv").config();
const config = require("../config.json");
const aes256 = require("aes256");

function isKeyAdmin(apiKey){
    const base64apiKey = Buffer.from(apiKey).toString("base64");

    for(const adminKey of config.adminKeys){
        if(base64apiKey === adminKey) return true;
    }

    return false;
}

module.exports = isKeyAdmin;
