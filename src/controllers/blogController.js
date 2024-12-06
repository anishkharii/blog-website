const Blog = require("../models/blogModel")
const Author = require("../models/authorModel");
const { errorHandle } = require("../errorhandling/errorhandling");
exports.addBlog = async(req,res)=>{ 
    try{
        const data = req.body;
        const author = await Author.findById(data.authorId);
        if(!author){
            return res.status(404).send("Author not found");
        }
        const newBlog =await Blog.create(data);
        
        res.status(201).send(newBlog);
    }catch(err){
        errorHandle(err,res);
    }
}

exports.showBlogs = async(req,res)=>{
    try{
        const {authorId, category, tags, subcategory} = req.query;
        

        const filters = {
            // isDeleted:false,
            // isPublished:true
        }
        if(authorId) filters.authorId=authorId;
        if(category) filters.category=category;
        if(tags) filters.tags={$in:[tags]};
        if(subcategory) filters.subcategory={$in:[subcategory]};
        
        const blogs = await Blog.find(filters);
        
        if(blogs.length == 0){
            return res.status(404).send("No blog found");
        }
        res.status(200).send(blogs);

    }catch(err){
        errorHandle(err,res);
    }
}

exports.updateBlog = async(req,res)=>{
    try{
        const blog = await Blog.findOne({isDeleted:false,_id:req.params.blogId});
        if(!blog){
            return res.status(404).send('Blog not found');
        }
        const data = req.body;
        const updatedData = {
            isPublished:true, 
            publishedAt:Date.now(),
        }
        if(data.title) updatedData.title=data.title;
        if(data.body) updatedData.body = data.body;
        if(data.category) updatedData.category = data.category;
        if(data.tags) updatedData.tags = data.tags;

        const updatedBlog = await Blog.findByIdAndUpdate({_id:req.params.blogId},updatedData,{new:true});
        res.status(200).send(updatedBlog);

    }catch(err){
        errorHandle(err,res);
    }
}

exports.deleteBlogById = async(req,res)=>{
    try{
        const blog = await Blog.findOne({isDeleted:false,_id:req.params.blogId});
        if(!blog){
            res.status(404).send("Blog not found");
        }
        const udpatedBlog = await Blog.findByIdAndUpdate({_id:req.params.blogId},{isDeleted:true},{new:true});
        res.status(200).send(udpatedBlog);

    }catch(err){
        res.status(500).send(err.message);
    }
}

exports.deleteBlogsByQuery = async(req,res)=>{
    try{
        const {authorId, category, tags, subcategory, isPublished} = req.query;
        
        const filters = {};
        if(authorId) filters.authorId=authorId;
        if(category) filters.category=category;
        if(isPublished) filters.isPublished = isPublished;
        if(tags) filters.tags={$in:[tags]};
        if(subcategory) filters.subcategory={$in:[subcategory]};


        const blogs = await Blog.find(filters);
        if(blogs.length===0){
            return res.status(404).send("No Blog Found");
        }
        const updatedBlogs = await Blog.updateMany(filters,{isDeleted:true});
        res.status(200).send(updatedBlogs);
        
    }catch(err){
        res.status(500).send(err.message);
    }
}