const mongoose = require("mongoose");
const {firstName,lastName,Validemail,Validpass} = require('../validation/Authorvalid')


const authorSchema = new mongoose.Schema({
    fname:{
        type:String,required:[true,'First name is required.'],trim:true, validate:[firstName,"Invalid first name"]
    },
    lname:{type:String,required:[true,'Last name is required.'],trim:true, validate:[lastName,"Invalid Last Name"]},
    title:{type:String,required:true,trim:true, enum:['Mr','Mrs','Miss']},
    email:{type:String,required:[true,"Email is required"],trim:true, validate:[Validemail,"Invalid email Id"]},
    image:{type:String,trim:true},
    password:{type:String,required:[true,"Password is required"],trim:true, validate:[Validpass,"Invalid Password"]},
    otp:{type:String, trim:true}
})

module.exports = mongoose.model("Author",authorSchema);