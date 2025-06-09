const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.get("/sendConnectionRequest", userAuth, (req, res) => {

    const user = req.user;
    const { firstName } = user;
    res.send(firstName + " sent a Connection request");
})

module.exports = requestRouter;