const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { User } = require("../models/user");
const userRouter = express.Router();

const POPLUTATED_DATA_FIELDS = "firstName lastName about age gender photoUrl skills";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const receivedRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", POPLUTATED_DATA_FIELDS);

        res.send({ message: "Fetched successfully!", data: receivedRequests })


    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", POPLUTATED_DATA_FIELDS).populate("toUserId", POPLUTATED_DATA_FIELDS);

        const connectionsData = connections.map(data => {
            if (data.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return data.toUserId;
            }
            return data.fromUserId;
        })

        res.json(connectionsData)

    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
})


userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequestsOfLoggedInUser = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        const hiddenUsersFromFeed = new Set();
        connectionRequestsOfLoggedInUser.forEach(conReq => {
            hiddenUsersFromFeed.add(conReq.fromUserId.toString());
            hiddenUsersFromFeed.add(conReq.toUserId.toString())
        })

        const feedUsersToShow = await User.find({
            $and: [
                { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(POPLUTATED_DATA_FIELDS).skip(skip).limit(limit)

        res.json(feedUsersToShow);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = userRouter;