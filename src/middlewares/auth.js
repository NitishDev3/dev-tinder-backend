const jwt = require("jsonwebtoken")
const { User } = require("../models/user")


const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Please Login")
        }
        const { id } = await jwt.verify(token, "DEV@Tinder.123");
        const profile = await User.findById(id).select("-password -__v -createdAt -updatedAt");
        if (!profile) {
            throw new Error("User not found")
        }
        req.user = profile;

        next();
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
}


module.exports = { userAuth }