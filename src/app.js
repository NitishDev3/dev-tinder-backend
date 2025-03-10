const express = require("express");
const { connectDB } = require("./config/Database");
const cookieParser = require("cookie-parser");


const authRouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestRouter = require("./router/request");
const userRouter = require("./router/user");


const app = express();

app.use(express.json())
app.use(cookieParser())

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter)

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

