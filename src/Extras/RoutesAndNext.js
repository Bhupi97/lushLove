const express = require('express');
const { adminAuth, userAuth } = require('./middlewares/auth')
const app = express();

// *** Order of routes matters ***

// app.use("/", (req, res) => {
//     res.send("Hi there from Homepage");
// });

// app.use method will match all the HTTP method API calls to /test
// app.use("/test", (req, res)=>{
//     res.send("Hi there from test");
// });

// app.post("/user", (req, res) => {
//     res.send({firstName: "Bhupinder Partap", lastName: "Singh"});
// });

// app.get("/user", (req, res) => {
//     res.send("User logged in");
// });

// app.delete("/user", (req, res) => {
//     res.send("User profile deleted successfully");
// });

// app.patch("/user", (req, res) => {
//     res.send("User profile updated successfully");
// });


// app.use("/hello", (req, res) => {
//     res.send("Hello Hello Hello");
// });

// // * means anything an come between ab and c
// app.get("/ab*c", (req, res) => {
//     res.send("Found the new route");
// });

// // Anything inside parenthesis {} means It is optional. There /ad will work or /abcd
// app.get("/a{bc}d", (req, res) => {
//     res.send("Found the new route abcd");
// });

// // Regex expression can be used as routes
// app.get(/.*fly$/, (req, res) => {
//     res.send("Found the new route which ends with fly");
// });

// // API link example: http://localhost:7777/user?name=Bp&age=28 Query starts after ? and & used for multiple values
// app.get("/user", (req, res) => {
//     res.send(req.query);
// });

// // API link example: http://localhost:7777/user/Bhupinder/28 after / are considered parameters, : Means a dynamic route
// app.get("/user/:userName/:Age", (req, res) => {
//     res.send(req.params);
// });

// app.get("/user",  (req, res, next) => {
//     next();
//     console.log("Console 1");
//     res.send("Response 1");
// },
//     (req, res, next) => {
//         next()
//         console.log("Console 2");
//         // res.send("Response 2");
//     },
//     (req, res, next) => {
//         next()
//         console.log("Console 3");
//         // res.send("Response 3");
//     },
//     (req, res, next) => {
//         // res.send("Response 4");
//         console.log("Console 4");
//         next();
//     }
// );

app.use("/user/login", (req, res) => {
    console.log("Enter user login details");
    res.send("Enter user credentials");
});

app.use("user/data", userAuth, (req, res) => {
    console.log("user data is displayed");
    res.send("User Details");
})


app.use("/admin/data", adminAuth, (req, res) => {
    console.log("Showing admin data");
    res.send("Admin data showing successfully");
})

app.use("/user", (req, res, next) => {
    const authToken = 'xyqz';
    const userAuthenticated = authToken === 'xyz';
    if (userAuthenticated) {
        next();
        res.send("User logged in successfully");
    }
    else {
        res.status(401).send("User not authenticated");
    }
})

app.get("/user/data", (req, res) => {
    res.send("User data is here");
})


app.listen(7777, () => {
    console.log("Server listening on Port 7777");
});


