const express = require("express");

const app = express();

// app.use("/hello", (req, res) => {
//     res.send("hello from hello");
// });

app.use("/", (req, res) => {
    res.send("Hello to all from the server!");
});

app.listen(7777, () => {
    console.log("Server is listening on port 7777");
});