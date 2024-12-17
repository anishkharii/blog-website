const mongoose = require("mongoose");
const {firstNameValid,lastNameValid,ValidemailValid,ValidpassValid} = require('../validation/userValid')


const userSchema = new mongoose.Schema({
    fname:{
        type:String,required:[true,'First name is required.'],trim:true, validate:[firstNameValid,"Invalid first name"]
    },
    lname:{type:String,required:[true,'Last name is required.'],trim:true, validate:[lastNameValid,"Invalid Last Name"]},
    title:{type:String,required:true,trim:true, enum:['Mr','Mrs','Miss']},
    email:{type:String,required:[true,"Email is required"],trim:true, validate:[ValidemailValid,"Invalid email Id"]},
    role:{type:String,enum:['author','admin','user'],trim:true},
    image:{type:String,trim:true},
    isVerified:{type:Boolean,default:false},
    isDeleted:{type:Boolean,default:false},
    password:{type:String,required:[true,"Password is required"],trim:true, validate:[ValidpassValid,"Invalid Password"]},
    otp:{type:String, trim:true},
    
})

module.exports = mongoose.model("User",userSchema);