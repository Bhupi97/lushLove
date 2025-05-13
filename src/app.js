const express = require("express");
const connectDB = require('./config/database');
const User = require('./models/user')

const app = express();

connectDB().then(
    () => {
            console.log("DB connected successfully.")
            app.listen(7777, () => {
            console.log("Server listening on Port 7777");
            });
          }).catch((err) => {
            console.error(err + " DB connection unsuccessull!!")
            }
        );


app.use(express.json());

app.post("/signup", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.send("User added successfully.")
    }
    catch (err) {
        res.status(400).send("Error adding a user: "+err.message)
    }
})

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length>0) {
            res.send("Users found :"+ users);
        }
    }
    catch (err) {
        res.status(400).send("An error occured!!!" + err.message);
    }
    

})

app.get("/feed", async (req, res) => {
    const emailId = req.body.email ;

    try {
        const users = await User.findById('680f36f417cd4efe0f0a1914');
        // User.findOne returns a single object whereas User.find returns an array of objects.
        console.log("User Found");
        res.send(users)
        // if (users.length>0) {
        //     console.log("User Found");
        //     res.send(users)
        // }
    }
    catch (err) {
       res.status(400).send("Error getting user");
    }
    
})

app.delete("/user", async (req, res) => {
    const userId = req.body._id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (deletedUser) {
            res.send("User deleted successfully and user details are: " + deletedUser);
        }
    }
    catch (err) {
        res.status(400).send("Delete unsuccessful due to error: ", err.message);
    }
    })

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = ["firstName", "lastName", "photoUrl", "about", "password", "gender", "skills", "age"];
        console.log(data);
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }
        if (data?.skills.length>10) {
            throw new Error("Maximum skills allowed are 10")
        }
        const updatedUser = await User.findByIdAndUpdate(userId, data, {returnDocument: 'after', runValidators: true});
        // console.log(updatedUser);
        if (updatedUser) {
            res.send("User updated successfully");
        }
    }
    catch (err) {
        res.status(200).send("Error occured: " + err.message);
    }

})