const jwt = require("jsonwebtoken");



//middleware to check and validate JWT token
const checkLogin = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: "Authorization header missing!" });
    }

    try {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Set user data from the decoded token
        const { username, id } = decoded;
        req.username = username;
        req.userId = id;
        next();
        //console.log("Decoded token:", decoded); Debug code
    } catch (err) {
        console.error("JWT verification failed:", err); // Log error for debugging
        return res.status(403).json({ message: "Authentication failure!" });
    }
};

module.exports = checkLogin ;
