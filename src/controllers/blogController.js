const Blog = require("../models/blogModel")
const User = require("../models/userModel");
const { errorHandle } = require("../errorhandling/errorhandling");


exports.addBlog = async(req,res)=>{ 
    try{
        const data = req.body;
        const user = await User.findById(data.userId);
        if(!user || !user.isVerified){
            return res.status(404).send({status:false,msg:"User not found. Please signup first."});
        }
        if(data.isPublished===true){
            data.publishedAt = Date.now();
        }
        const newBlog =await Blog.create(data);
        
        res.status(201).send({status:true,msg:"Successfully created blog",data:newBlog});
    }catch(err){
        errorHandle(err,res);
    }
}


exports.showBlog = async(req,res)=>{
    try{
        const id = req.params.id;
        const filters = {
            isDeleted:false
        }
        const blog = await Blog.findOne({...filters,_id:id});
        
        if(!blog){
            return res.status(404).send({status:false,msg:"Blog not found"});
        }
        res.status(200).send({status:true,data:blog});

    }catch(err){
        errorHandle(err,res);
    }
}

exports.showBlogs = async(req,res)=>{
    try{
        const {userId, category, tags, subcategory, isPublished} = req.query;
        
        const filters = {
            isDeleted:false,
        };
        if(userId) filters.userId=userId;
        if(category) filters.category=category;
        if(isPublished) filters.isPublished = isPublished;
        if(tags) filters.tags={$in:[tags]};
        if(subcategory) filters.subcategory={$in:[subcategory]};
        
        
        const blogs = await Blog.find(filters);
        
        if(blogs.length == 0){
        return res.status(404).send({status:false,msg:"No Blog Found"});
        }
        res.status(200).send({status:true,data:blogs});

    }catch(err){
        errorHandle(err,res);
    }
}



exports.updateBlog = async(req,res)=>{
    try{
        const blog = await Blog.findOne({isDeleted:false,_id:req.params.blogId});
        if(!blog){
            return res.status(404).send({status:false,msg:"Blog not found"});
        }
        const data = req.body;
        const updatedData = {}
        if(data.title) updatedData.title=data.title;
        if(data.body) updatedData.body = data.body;
        if(data.category) updatedData.category = data.category;
        if(data.tags) updatedData.tags = data.tags;
        if(data.subcategory) updatedData.subcategory = data.subcategory;
        if(data.isPublished) {
            updatedData.isPublished = data.isPublished;
            updatedData.publishedAt = Date.now();
        }
        if(data.isPublished===false){
            updatedData.isPublished = data.isPublished;
            updatedData.publishedAt = null;
        }

        const updatedBlog = await Blog.findByIdAndUpdate({_id:req.params.blogId},updatedData,{new:true});
        res.status(200).send({status:true,msg:"Successfully updated blog",data:updatedBlog});

    }catch(err){
        errorHandle(err,res);
    }
}

exports.deleteBlogById = async(req,res)=>{
    try{
        const blog = await Blog.findOne({isDeleted:false,_id:req.params.blogId});
        if(!blog){
            res.status(404).send({status:false,msg:"Blog not found"});
        }
        const udpatedBlog = await Blog.findByIdAndUpdate({_id:req.params.blogId},{isDeleted:true},{new:true});
        res.status(200).send({status:true,msg:"Successfully deleted blog",data:udpatedBlog});

    }catch(err){
        errorHandle(err,res);
    }
}

exports.deleteBlogsByQuery = async(req,res)=>{
    try{
        const {userId, category, tags, subcategory, isPublished} = req.query;
        
        const filters = {};
        if(userId) filters.userId=userId;
        if(category) filters.category=category;
        if(isPublished) filters.isPublished = isPublished;
        if(tags) filters.tags={$in:[tags]};
        if(subcategory) filters.subcategory={$in:[subcategory]};


        const blogs = await Blog.find(filters);
        if(blogs.length===0){
            return res.status(404).send({status:false,msg:"No Blog Found"});
        }
        const updatedBlogs = await Blog.updateMany(filters,{isDeleted:true});
        res.status(200).send({status:true,msg:"Successfully deleted blog",data:updatedBlogs});
        
    }catch(err){
        errorHandle(err,res);
    }
}