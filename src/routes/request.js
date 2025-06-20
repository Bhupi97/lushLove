const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user');



requestRouter.post("/request/send/:status/:receiver", userAuth, async (req, res) => {

    const user = req.user;
    const sender = user.id;
    const status = req.params.status;
    const receiver = req.params.receiver;
    // res.send(firstName + " sent a Connection request");

    try {

        const allowedStatus = ["like", "pass"];
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message: "Invalid status type: " + status})
        }

        const receiverExists = await User.findById(receiver);
        if(!receiverExists) {
            res.status(404).json({message: "User not found!"});
        }
        if(sender === receiver) {
            throw new Error("You can't send request to yourself, you dumb fuck!");
        }
        const requestExists = await ConnectionRequest.findOne({ $or: [{sender, receiver}, {sender: receiver, receiver: sender}]});
        console.log(requestExists);
        if (requestExists) {
            return res.status(400).json({message: "Request already exists"});
        }
        const connectionRequest = new ConnectionRequest({sender, receiver, status});
        await connectionRequest.save();
        res.status(200).send('Request sent successfully');

    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }

    
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {

    const currentUser = req.user;
    const { status, requestId } = req.params;
    try {
        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)) {
            return res.status(400).send("Invalid request!");
        }
        // console.log(currentUser._id);
        console.log(requestId);
        const requestFound = await ConnectionRequest.findOne({_id: requestId, receiver: currentUser._id, status: "like"});
        // console.log(requestFound);
        if(!requestFound) {
            return res.status(404).json({message: "Request not found"});
        }
        requestFound.status = status;
        const data = await requestFound.save();
        res.status(200).json({message: "Connection request accepted", data: data});
        
    }
    catch (err) {
        res.status(400).send("ERROR :" + err.message);
    }


})

module.exports = requestRouter;