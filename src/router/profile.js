const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

const { User } = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { editProfileValidation } = require("../utils/validations");

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const profile = req.user;
        res.send(profile);
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const user = req.user;

        inputData = editProfileValidation(req)
        const updatedUserData = await User.findByIdAndUpdate(user._id, inputData, { new: true, runValidators: true }).select("-password -__v");
        res.send({ message: "Updated Successfully", data: updatedUserData });
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
})

profileRouter.patch("/forgotpassword", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { oldPassword, newPassword } = req.body;

        const isPasswordValid = await user.passwordValidation(oldPassword);

        if (!isPasswordValid) {
            throw new Error("Old Passward is not valid")
        } else if (!validator.isStrongPassword(newPassword)) {
            throw new Error("New Passward should be strong")
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword })
        res.send("Password Updated successfully!!")
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }


})


module.exports = profileRouter;