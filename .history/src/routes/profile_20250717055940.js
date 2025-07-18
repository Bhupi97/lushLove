const express = require("express");
const profileRouter = express.Router();
const validator = require("validator");
const { userAuth } = require("../middlewares/auth");
const User = require('../models/user');
const { validateProfileEdit } = require("../utils/validate");
const bcrypt = require("bcrypt");


profileRouter.get("/profile/view", userAuth, async (req, res) => {

    try {
        const user = req.user;

        res.send(user);
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }

})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateProfileEdit(req.body)) {
            throw new Error("Invalid update request!!!")
        }
        const loggedInUser = req.user;
        console.log(req.body);
        if(req?.body?.firstName && req?.body?.firstName.length>30) {
            throw new Error("Invalid firstname!!!")
        }
        if(req?.body?.lastName && req?.body?.lastName.length>30) {
            throw new Error("Invalid lastname!!!")
        }
        if(req?.body?.skills && req?.body?.skills.>10) {
            throw new Error("Skills should not exceed 10")
        }
        if(req?.body?.age && !validator.isNumeric(req?.body?.age) && req?.body?.age>90) {
            throw new Error("Invalid Age")
        }
        if(req?.body?.photoUrl && !validator.isURL(req?.body?.photoUrl)){
            throw new Error("Invalid image url");
        }
        if(req?.body?.about && req?.body?.about.length > 120) {
            throw new Error("About length should not exceed 100 characters")
        }
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        console.log(loggedInUser);
        
        await loggedInUser.save();
        res.send(`${loggedInUser.firstName}, your profile updated successfully`);
    } catch (err) {
        res.status(400).send("ERROR: "+ err.message);
    }
    
})

profileRouter.patch("/profile/changepassword", userAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmedNewPasword } = req.body;
        const loggedInUser = req.user;
        const isCurrentPasswordMatches = loggedInUser.validatePassword(currentPassword);
    if (!isCurrentPasswordMatches) {
            throw new Error("Invalid Current password!!!");
        }
    if (newPassword !== confirmedNewPasword) {
            throw new Error("New passwords not matching.");
        }
    if(!validator.isStrongPassword(confirmedNewPasword)){
        throw new Error("New Password is not strong");
    }
    const hashedPassword = await bcrypt.hash(confirmedNewPasword, 10);
    loggedInUser.password = hashedPassword;
    console.log(loggedInUser.password);
    await loggedInUser.save();
    res.send("Password changed successfully.")
    }

    catch (err) {
        res.status(400).send("ERROR: "+err.message);
    }
    })
    

// profileRouter.get("/users", async (req, res) => {
//     try {
//         const users = await User.find({});
//         if (users.length>0) {
//             res.send("Users found :"+ users);
//         }
//     }
//     catch (err) {
//         res.status(400).send("An error occured!!!" + err.message);
//     }
// })

// profileRouter.get("/feed", async (req, res) => {
//     const emailId = req.body.email ;

//     try {
//         // const users = await User.findById('680f36f417cd4efe0f0a1914');
//         // User.findOne returns a single object whereas User.find returns an array of objects.
//         const users = await User.find({email: emailId});
//         res.send(users);
//         // if (users.length>0) {
//         //     console.log("User Found");
//         //     res.send(users)
//         // }
//     }
//     catch (err) {
//        res.status(400).send("Error getting user");
//     }  
// })

// profileRouter.delete("/user", async (req, res) => {
//     const userId = req.body._id;
//     try {
//         const deletedUser = await User.findByIdAndDelete(userId);
//         if (deletedUser) {
//             res.send("User deleted successfully and user details are: " + deletedUser);
//         }
//     }
//     catch (err) {
//         res.status(400).send("Delete unsuccessful due to error: ", err.message);
//     }
//     })

// profileRouter.patch("/user/:userId", async (req, res) => {
//     const userId = req.params?.userId;
//     const data = req.body;
//     try {
//         const ALLOWED_UPDATES = ["firstName", "lastName", "photoUrl", "about", "password", "gender", "skills", "age", "email"];
//         console.log(data);
//         const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
//         if (!isUpdateAllowed) {
//             throw new Error("Update not allowed");
//         }
//         // if (data?.skills.length>10) {
//         //     throw new Error("Maximum skills allowed are 10")
//         // }
//         const updatedUser = await User.findByIdAndUpdate(userId, data, {returnDocument: 'after', runValidators: true});
//         // console.log(updatedUser);
//         if (updatedUser) {
//             res.send("User updated successfully");
//         }
//     }
//     catch (err) {
//         res.status(200).send("Error occured: " + err.message);
//     }

// })

module.exports = profileRouter;