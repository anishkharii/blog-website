const User = require("../models/userModel");
const { errorHandle } = require("../errorhandling/errorhandling");
const { verificationOtp } = require("../nodemailer/mailsender");
const { uploadImage } = require("../Cloudinary/imgHandler");
require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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


    if(req.file){
      const img_url = await uploadImage(req.file.path);
      req.body.image = img_url;
    }

    req.body.otp = randomOtp;
    
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashPassword;
    const newUser = await User.create(data);

    const Name = ` ${newUser.fname} ${newUser.lname}`;
    const email = newUser.email; 
    verificationOtp(email, Name, randomOtp);

    const result = {
      image: newUser.image,
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

exports.verifyUser = async (req, res) => {
  try {
    const id = req.params.userId;
    const otp  = req.body.otp;
    const user = await User.findById({_id:id});
    if(user.isVerified) return res.status(400).send({status:false,msg:"Invalid Params. User already verified."});
    if (!user)
      return res.status(404).send({ status: false, msg: "Invalid Params. Please signup first." });
    if (otp != user.otp)
      return res.status(400).send({ status: false, msg: "Otp not matched. Please try again." });

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { isVerified: true },
      { new: true }
    );
    res.status(200).send({
        status: true,
        msg: "User verified Successfully. Please login.",
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

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(400).send({status:false,msg:'User not found.'});
    res.status(200).send({status:true,user});
  } catch (err) {
    res.status(500).send({status:false,msg:err.message});
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({isVerified:true,isDeleted:false});

    res.status(200).send({status:true,users});
  } catch (err) {
    errorHandle(err, res);
  }
};
