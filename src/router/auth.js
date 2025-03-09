const express = require("express");
const authRouter = express.Router();

const { User } = require("../models/user");
const { signUpValidation } = require("../utils/validations");
const bcrypt = require("bcrypt");


authRouter.post("/signup", async (req, res) => {
    try {
        signUpValidation(req);

        const { emailId, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ ...req.body, emailId: emailId.toLowerCase(), password: hashedPassword });
        await user.save();
        res.send("User created successfully");
    } catch (error) {
        res.status(400).send("Error creating user: " + error.message);
    }
})


authRouter.post("/login", async (req, res) => {

    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId.toLowerCase() });

        if (!user) {
            throw new Error("Invalid Credentials! here 1 " + user);
        }

        const isPasswordValid = await user.passwordValidation(password)
        if (!isPasswordValid) {
            throw new Error("Invalid Credentials! here 2");
        } else {
            const token = await user.generateToken();
            res.cookie("token", token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
            // {expires : 0} // will set session cookies.

            res.send("Login successful!");
        }
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
})


authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logout Successful!!!");
})


module.exports = authRouter;