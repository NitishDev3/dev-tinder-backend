const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: "{VALUE} is not valid status type"
        }
    }
},
    {
        timestamps: true
    }
)

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

connectionRequestSchema.pre("save", function (next) {
    const { toUserId, fromUserId } = this;
    if (toUserId.equals(fromUserId)) {
        throw new Error("Can't send request to yourself");
    }
    next()
})


const ConnectionRequest = new mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;