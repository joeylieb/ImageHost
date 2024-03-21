const userModel = require("../schema/user");


const authCheck = async (req, res, next) => {
    const key = req.header("Authorization");

    if(!key){
        return res.status(401).json({status: 401, d: {error: "No token provided"}})
    }

    const user = await userModel.findOne({apiKey: key});

    if(!user){
        return res.status(401).json({status: 401, d: {error: "Invalid API key"}})
    }

    req.user = user;

    next();
}

module.exports = authCheck;
