const User = require("../models/userModel");
const { errorHandle } = require("../errorhandling/errorhandling");
const { verificationOtp } = require("../nodemailer/mailsender");
const { uploadImage } = require("../Cloudinary/imgHandler");
require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.wakeUp = (req,res)=>{res.status(200).send({status:true,msg:"Connected to server."})};
exports.addUser = async (req, res) => {
  try {
    const data = req.body;
    const randomOtp = Math.floor(1000 + Math.random()*9000);

    const user = await User.findOneAndUpdate({ email: data.email },{$set:{otp:randomOtp}});
    
    if (user) {
        if(!user.isVerified){

          const Name1 = `${user.fname} ${user.lname}`;
          const email1 = user.email;
          verificationOtp(email1, Name1, randomOtp);
          return res.status(200).send({status:true,msg:"Otp is sended to your mail please verify it.",data:{id:user._id}});
        } 
        return res.status(200).send({status:false,msg:"User already verified. Please Login."});
    }


    req.body.otp = randomOtp;
    
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashPassword;
    const newUser = await User.create(data);

    const Name = ` ${newUser.fname} ${newUser.lname}`;
    const email = newUser.email; 
    verificationOtp(email, Name, randomOtp);

    const result = {
      fname: newUser.fname,
      lname: newUser.lname,
      email: newUser.email,
      password: newUser.password,
      id: newUser._id,
    }

    res.status(201).send({
        status: true,
        msg: "Please verify the otp sented to your mail",
        data: result,
      });
  } catch (err) {
    errorHandle(err, res);
  }
};

exports.updateUser = async(req,res)=>{
  try{
    const {fname, lname} = req.body;
    const data = {};
    if(fname) data.fname = fname;
    if(lname) data.lname = lname;
    if(req.file){
      const result = await uploadImage(req.file.path);
      data.image = result;
    }
    
    const id = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(id,data,{new:true});
    res.status(200).send({status:true,msg:"Successfully updated user",data:updatedUser});
  }catch(err){
    errorHandle(err,res);
  }
}

exports.deleteUser = async(req,res)=>{
  try{
    const id = req.params.id;
    const deletedUser = await User.findByIdAndUpdate(id,{isDeleted:true},{new:true});
    res.status(200).send({status:true,msg:"Successfully deleted user",data:deletedUser});
  }catch(err){
    errorHandle(err,res);
  }
}

exports.verifyUser = async (req, res) => {
  try {
    const id = req.params.id;
    const otp  = req.body.otp;
    const type= (req.body.type)?req.body.type:'verify';
    const user = await User.findById({_id:id});
    if (!user)
      return res.status(404).send({ status: false, msg: "Invalid Params. Please signup first." });

    if(user.isVerified && type!=='forgot') 
      return res.status(400).send({status:false,msg:"Invalid Params. User already verified."});
    
    if (otp != user.otp)
      return res.status(400).send({ status: false, msg: "Otp not matched. Please try again." });

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { isVerified: true },
      { new: true }
    );
    res.status(200).send({
        status: true,
        msg: "User verified Successfully.",
        data: updatedUser,
      });
  } catch (err) {
    errorHandle(err, res);
  }
};

exports.loginUser = async (req, res) => {
  try{ 
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).send({status:false,msg:'All fields are required.'});
    const user = await User.findOne({email:email});
    if(!user) return res.status(400).send({status:false,msg:'User not found. Please signup.'});

    const matchPassword = await bcrypt.compare(password, user.password);
    if(!matchPassword) return res.status(400).send({status:false,msg:'Password is incorrect.'});

    if(!user.isVerified){
      const Name = `${user.fname} ${user.lname}`;
      const randomOtp = Math.floor(1000 + Math.random()*9000);
      user.otp = randomOtp;
      await user.save();
      verificationOtp(email,Name,randomOtp);
      return res.status(400).send({status:false,type:'otp',msg:'Please verify your account. Otp sented to your mail',id:user._id});
    } 
    

    const token = jwt.sign({id:user._id},process.env.USER_TOKEN,{expiresIn:'1d'});
    
    res.status(200).send({status:true,msg:'You are Successfully logged in.',token:token,id:user._id,role:user.role});


  }catch(err){
    errorHandle(err,res);
  }
} 

exports.resetPassword = async(req, res)=>{
  try{
    const {email,password} = req.body;
    const user = await User.findOne({email:email});
    if(!user) return res.status(400).send({status:false,msg:'User not found. Please signup.'});
    const randomOtp = Math.floor(1000 + Math.random()*9000);
    user.otp = randomOtp;
    await user.save();
    const Name = `${user.fname} ${user.lname}`;
    verificationOtp(email,Name,randomOtp);
    return res.status(400).send({status:false,type:'otp',msg:'Please verify your account. Otp sented to your mail',id:user._id});
  }catch(err){
    errorHandle(err,res);
  }
}

exports.forgotPasswordStep1 = async (req,res)=>{
  try{
    const {email} = req.params;
    const user = await User.findOne({email:email});
    if(!user) return res.status(404).send({status:false,msg:"User does not exists"});
    const name = user.fname+" "+user.lname;
    const randomOtp = Math.floor(1000 + Math.random()*9000);
    user.otp = randomOtp;
    await user.save();
    verificationOtp(email,name,randomOtp);
    res.status(200).send({status:true,msg:"OTP Successfully sented to your mail.",id:user._id});

  }catch(err){
    errorHandle(err,res);
  }
}

exports.forgotPasswordStep2=async(req,res)=>{
  try{
    const { password} = req.body;
    const user = await User.findOne({_id:req.params.id});
    if(!user) return res.status(404).send({status:false,msg:"User not Found."});

    const newHashedPassword = await bcrypt.hash(password,10);
    user.password = newHashedPassword;
    await user.save();
    res.status(200).send({status:true, msg:"Successfully changed Password."})
  }catch(err){
    errorHandle(err,res);
  }
}


exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if(!user) return res.status(400).send({status:false,msg:'User not found.'});
    res.status(200).send({status:true,user});
  } catch (err) {
    res.status(500).send({status:false,msg:err.message});
  }
};

exports.getUserName = async (req, res) => {
  try {
    const user = await User.findOne({_id:req.params.id, isDeleted:false});
    if(!user) return res.status(400).send({status:false,msg:'User not found.'});
    res.status(200).send({status:true,name:`${user.fname} ${user.lname}`});
  } catch (err) {
    res.status(500).send({status:false,msg:err.message});
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const {_id, fname, lname, email, role, isVerified , isDeleted, title} = req.query;
    const filters ={};
    if(_id) filters._id=_id;
    if(fname) filters.fname=fname;
    if(lname) filters.lname=lname;
    if(email) filters.email=email;
    if(role) filters.role=role;
    if(isVerified) filters.isVerified=isVerified;
    if(isDeleted) filters.isDeleted=isDeleted;
    if(title) filters.title=title;
    const users = await User.find(filters);
    if(users.length===0) return res.status(404).send({status:false,msg:"No User Found"});
    res.status(200).send({status:true,users});
  } catch (err) {
    errorHandle(err, res);
  }
};
