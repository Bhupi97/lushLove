
const express = require("express");
const bcrypt = require("bcrypt")
const { validateSignup, validateEmail } = require('../utils/validate'); 
const User = require('../models/user');
const authRouter = express.Router();


authRouter.post("/signup", async (req, res) => {
    
    try {
        // validate user credentials.
        validateSignup(req.body);
        // Creating password hash
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });
        await user.save();
        res.send("User added successfully.")
    }
    catch (err) {
        res.status(400).send("Error adding a user: "+err.message)
    }
})

authRouter.post("/login", async (req, res) => {

    const { email, password } = req.body;
    try {
        validateEmail(email);
        const user = await User.findOne({email: email});

        if (!user) {
            throw new Error("Invalid credentials!!!")
        }
        const isPasswordMatched = await user.validatePassword(password);
        if (!isPasswordMatched) {
            throw new Error("Invalid credentials!!!");
        }
        else {
            const token = await user.getJWT();
            res.cookie("token", token);
            res.send(user);
        }
    }
    catch (err) {
        res.status(401).send("ERROR : " + err.message);
    }
})

authRouter.post("/logout", (req, res) => {
    try {
        res.cookie("token", null, { expires: new Date(Date.now())});
        res.send("User logged out successfully");
    }
    catch (err) {
        console.error("ERROR occured while logging out")
    }
    
})

module.exports = authRouter;