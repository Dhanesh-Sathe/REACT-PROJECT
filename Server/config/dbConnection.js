const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connect to MongoDB");
    }
    catch(err){
        console.error(err);
    }
}

module.exports = connectDB;