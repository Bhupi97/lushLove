const express = require('express');

const app = express();

app.get("/", (req, res) => {
    res.send("Hi there from Homepage");
});

app.use("/test", (req, res)=>{
    res.send("Hi there from test");
});

app.use("/hello", (req, res) => {
    res.send("Hello Hello Hello");
});

app.listen(3000, () => {
    console.log("Server listening on Port 3000");
});