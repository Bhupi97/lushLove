
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');


const adminAuth = (req, res, next) => {
    const authToken = 'abca';
    const adminAuthenticated = authToken === 'abc';
    if (adminAuthenticated) {
        next();
    }
    else {
        res.status(401).send("Admin not authenticated");
    }
}

const userAuth = async (req, res, next) => {

    try {
        const { token } = req.cookies;
        // console.log(token);
        if(!token) {
            return res.status(401).send("Please login!");
        }
        const decodedObj = await jwt.verify(token, 'MayTheCodeBeWithYou$2025');
        if(!decodedObj) {
            throw new Error("Invalid token!!!")
        }
        const { id } = decodedObj;

        const user = await User.findById(id);
        if(!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }


 };

module.exports = { adminAuth, userAuth }