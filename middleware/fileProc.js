const multer = require("multer");
const upload = multer({
    storage: multer.memoryStorage()
}).single("file");

module.exports = upload;

