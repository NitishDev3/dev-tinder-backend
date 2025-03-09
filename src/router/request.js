const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { User } = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const { toUserId, status } = req.params;

        const allowedStatus = ["interested", "ignored"];
        if (!allowedStatus.includes(status)) {
            throw new Error("Can't send request with invalid status type: " + status)
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            throw new Error("User not found")
        }

        const isConnectionRequestExist = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (isConnectionRequestExist) {
            throw new Error("Connection request already exist!");
        }

        const connectionRequestdata = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequestdata.save();

        res.send("Connection request sent successfully!!");
    } catch (error) {
        res.status(404).send("ERROR: " + error.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const { status, requestId } = req.params;
        const loggedInUser = req.user;

        //validate status
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            throw new Error("Not a valid status type " + status);
        }
        //validate req ID

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })
        if (!connectionRequest) {
            throw new Error("Connection request not valid!");
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.send({ message: "Connection request " + status, data: data })

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})


module.exports = requestRouter;