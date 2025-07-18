const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require('./config/database');

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user")




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
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
