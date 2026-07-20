const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        console.log("Header:", authHeader);

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        const token = authHeader.split(" ")[1];

        console.log("Token:", token);
        console.log("Secret:", process.env.JWT_SECRET);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded:", decoded);

        req.user = decoded;

        next();

    } catch (err) {
        console.log("JWT ERROR:", err);

        return res.status(401).json({
            success: false,
            message: "Invalid or Expire Token"
        });
    }
};

module.exports = authMiddleware;