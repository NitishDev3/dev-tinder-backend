const express = require("express");
const { connectDB } = require("./config/Database");
const { User } = require("./models/user");
const { signUpValidation, updateProfileValidations } = require("./utils/validations");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth")


const app = express();

app.use(express.json())
app.use(cookieParser())


app.post("/signup", async (req, res) => {
    try {
        signUpValidation(req);

        const { password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ ...req.body, password: hashedPassword });
        await user.save();
        res.send("User created successfully");
    } catch (error) {
        res.status(400).send("Error creating user: " + error.message);
    }
})

app.post("/login", async (req, res) => {

    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId.toLowerCase()});
        if (!user) {
            throw new Error("Invalid Credentials!");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid Credentials!");
        } else {

            const token = await jwt.sign({ id: user._id }, "DEV@Tinder.123", {expiresIn : "7d"})

            res.cookie("token", token);
            res.send("Login successful!");
        }
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
})

app.get("/profile", userAuth, async (req, res) => {
    try {
        const profile = req.body;
        res.send(profile);
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
})

app.post("/sendRequest", userAuth, (req, res) => {

    try {
        const { firstName } = req.body;

        res.send(firstName + " sent a request!");
    } catch (error) {
        res.status(404).send("ERROR: " + error.message);
    }
})

// app.patch("/updateProfile", userAuth, async (req, res) => {
//     try {
//         const data = req.body;

//         const ALLOWED_UPDATES = ['lastName', 'age', 'photoUrl', 'skills', 'gender', 'password', 'about'];
//         const isValidUpdates = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

//         if (!isValidUpdates) {
//             throw new Error("Not valid updates");
//         }

//         if (data.skills) {
//             const skills = [...new Set(data.skills)]
//             if (skills.length < 3 || skills.length > 10) {
//                 throw new Error("There should be 3 to 10 unique skills");
//             } else {
//                 data.skills = skills;
//             }
//         }

//         await User.findByIdAndUpdate(data._id, data, { runValidators: true });
//         res.send("Updated Successfully");
//     } catch (error) {
//         res.status(400).send("Something went wrong : " + error.message);
//     }
// })


//this will handle all the http req - GET, POST, PATCH, DELETE

app.use("/", (err, req, res, next) => {
    res.send("hello from server");
});


connectDB()
    .then(() => {
        console.log("DB connected successfully!")
        app.listen(7777, () => {
            console.log("Server is listening on port 7777");
        });
    })
    .catch((error) => {
        console.log(error.message)
    })

