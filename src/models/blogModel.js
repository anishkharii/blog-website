const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title:{type:String,required:[true,'Title is required'],trim:true},
    body:{type:String,required:[true,'Body is required'],trim:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:[true,'User Id is required']},
    tags:{type:[String]},
    category:{type:String,required:[true,'Category is required'],trim:true},
    subcategory:{type:[String]},
    deletedAt:{type:Date},
    isDeleted:{type:Boolean,default:false},
    publishedAt:{type:Date},
    isPublished:{type:Boolean,default:false}
},{timestamps:true})

module.exports = mongoose.model("Blog",blogSchema);

