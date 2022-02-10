const jwt = require("jsonwebtoken");

const authorize = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        // console.log("token : ", token);
        const decoded = jwt.verify(token, "secret");
        req.userData = decoded;
        next();

    } catch(err) {
        console.log("err in authencation : ", err);
        return res.status(401).json({
            msg : "Authencation failed!!!!"
        })
    }
};

module.exports = authorize;