const {BlobServiceClient} = require("@azure/storage-blob");
require("dotenv").config();

const connectionString = process.env.CONNECTION_STRING;
if(!connectionString) return;
const blobServiceClient = BlobServiceClient.fromConnectionString(
    connectionString
);

function getServiceClient(){
    return blobServiceClient;
}

module.exports = {getServiceClient};
