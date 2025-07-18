const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender about skills photoUrl";
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const currentUser = req.user;
    // console.log(currentUser._id);
    const requests = await connectionRequest.find({
        receiver: currentUser._id, status: "like"
    })
    // .populate('sender', ['firstName', 'lastName']); same as bottom one
    .populate('sender', USER_SAFE_DATA);
    if(!requests) {
        return res.json({message: "No new requests"})
    }
    res.status(200).json({message: "There are "+ requests.length + " pending requests",
        data: requests
    });
    }
    catch (err) {
        res.status(400).send("ERROR: "+ err.message);
    }
    
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const currentUser = req.user;
        const connections = await connectionRequest.
        find({
            $or : 
            [{sender: currentUser._id, status: "accepted"},
            {receiver: currentUser._id, status: "accepted"}
        ]}).populate('sender', USER_SAFE_DATA).populate('receiver', USER_SAFE_DATA);
        const filteredConnections = connections.map((row) => {
            if(row.sender._id.toString() === currentUser._id.toString()){
                return row.receiver;
            }
            return row.sender;
        });

        // .filter((record) => record._id.toString() !== currentUser._id.toString());
        if(!filteredConnections) {
            return res.status(404).json({message: "You have no connections"});
        }
        res.status(200).json({message: "You have " + filteredConnections.length + " connections",
            data: filteredConnections
        });
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
    
} )

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const currentUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        
        const skip = (page-1)*limit;

    const connectionRequests = await connectionRequest.find({
        $or: [{
            sender: currentUser._id
        },
        {receiver: currentUser._id
        }]
    }).select("sender receiver");
    // console.log(connectionRequest);

    const hideUsers = new Set();
    connectionRequests.forEach((req) => {
        hideUsers.add(req.sender.toString());
        hideUsers.add(req.receiver.toString());
    })
    console.log(hideUsers);
    const users = await User.find({ 
        $and: [{            
                _id: 
                    {$nin: [...hideUsers]},
                },
                { _id: 
                    {$ne: currentUser._id}
                }], 
                }).select(USER_SAFE_DATA).skip(skip).limit(limit);
    res.json(users);
    }
    catch (err) {
        res.status(400).send("ERROR: "+err.message);
    }

})

module.exports = userRouter;