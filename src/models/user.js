const mongoose = require("mongoose");
const validator = require("validator")
const { Schema } = mongoose;


const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20,
        trim: true,
    },
    lastName: {
        type: String,
        minLength: 4,
        maxLength: 20,
        trim: true,
    },
    emailId: {
        type: String,
        required: true,
        lowerCase: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not a valid Email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong");
            }
        }
    },
    age: {
        type: Number,
        trim: true,
        min: [18, "Must be above 18"],
        max: [60, "Must be below 60"],
    },
    gender: {
        type: String,
        lowerCase: true,
        enum: { values: ['male', 'female'], message: '{VALUE} is not supported, should be either male or female' },
    },
    photoUrl: {
        type: String,
        default: "https://www.cgg.gov.in/wp-content/uploads/2017/10/dummy-profile-pic-male1.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Not a valid Photo Url");
            }
        }
    },
    about: {
        type: String,
        minLength: 30,
        maxLength: 250,
    },
    skills: {
        type: [String],
    }
},
    {
        timestamps: true,
    }
)

const User = mongoose.model("User", userSchema);

module.exports = { User };