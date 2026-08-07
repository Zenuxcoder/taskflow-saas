const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {

        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });

    }
};

module.exports = authMiddleware;