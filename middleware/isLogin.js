const jwt = require("jsonwebtoken")

const isLogin = async (req,res,next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.send(401).send("Unaurhorize Token Not Found");
        }
        const decode = jwt.verify(token, process.env.JwtToken);
        req.role = decode.role;
        req.fullname = decode.fullname;
        next();
    } catch (error) {
        res.status(201).send("UnAuthorize");
    }
}

module.exports = isLogin;