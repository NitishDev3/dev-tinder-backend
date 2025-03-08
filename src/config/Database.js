const mongoose = require('mongoose');

//vixg6V7on6mieCfx


const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://test:vixg6V7on6mieCfx@learnmern.kep3j.mongodb.net/dev-tinder");
}


module.exports = {connectDB};