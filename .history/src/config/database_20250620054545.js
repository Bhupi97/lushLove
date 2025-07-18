const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://LabTest:Lab*Test*1497@testdata.b9vh0.mongodb.net/?retryWrites=true&w=majority&appName=TestData");
};

module.exports = connectDB;