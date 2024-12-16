const Author = require("../models/authorModel");
const { errorHandle } = require("../errorhandling/errorhandling");
const { verificationOtp } = require("../nodemailer/mailsender");
const { uploadImage } = require("../Cloudinary/imgHandler");
require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.addAuthor = async (req, res) => {
  try {
    const data = req.body;
    const randomOtp = Math.floor(1000 + Math.random()*9000);

    const author = await Author.findOneAndUpdate({ email: data.email },{$set:{otp:randomOtp}});
    
    if (author) {
        if(!author.isVerified){

          const Name1 = `${author.fname} ${author.lname}`;
          const email1 = author.email;
          verificationOtp(email1, Name1, randomOtp);
          return res.status(200).send({status:true,msg:"Otp is sended to your mail please verify it.",id:author._id});
        }
        return res.status(200).send({status:false,msg:"Author already verified. Please Login."});
    }


    if(req.file){
      const img_url = await uploadImage(req.file.path);
      req.body.image = img_url;
    }

    req.body.otp = randomOtp;
    
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashPassword;
    const newAuthor = await Author.create(data);

    const Name = ` ${newAuthor.fname} ${newAuthor.lname}`;
    const email = newAuthor.email; 
    verificationOtp(email, Name, randomOtp);

    const result = {
      image: newAuthor.image,
      fname: newAuthor.fname,
      lname: newAuthor.lname,
      email: newAuthor.email,
      password: newAuthor.password,
      id: newAuthor._id,
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

exports.verifyAuthor = async (req, res) => {
  try {
    const id = req.params.userId;
    const otp  = req.body.otp;
    const author = await Author.findById({_id:id});
    if(author.isVerified) return res.status(400).send({status:false,msg:"Invalid Params. Author already verified."});
    if (!author)
      return res.status(404).send({ status: false, msg: "Invalid Params. Please signup first." });
    if (otp != author.otp)
      return res.status(400).send({ status: false, msg: "Otp not matched. Please try again." });

    const updatedAuthor = await Author.findByIdAndUpdate(
      author._id,
      { isVerified: true },
      { new: true }
    );
    res.status(200).send({
        status: true,
        msg: "Author verified Successfully. Please login.",
        data: updatedAuthor,
      });
  } catch (err) {
    errorHandle(err, res);
  }
};

exports.loginAuthor = async (req, res) => {
  try{ 
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).send({status:false,msg:'All fields are required.'});
    const author = await Author.findOne({email:email});
    if(!author) return res.status(400).send({status:false,msg:'Author not found. Please signup.'});
    
    if(!author.isVerified){
      const Name = `${author.fname} ${author.lname}`;
      const randomOtp = Math.floor(1000 + Math.random()*9000);
      author.otp = randomOtp;
      await author.save();
      verificationOtp(email,Name,randomOtp);
      return res.status(400).send({status:false,type:'otp',msg:'Please verify your account. Otp sented to your mail',id:author._id});
    } 
    
    const matchPassword = await bcrypt.compare(password, author.password);
    if(!matchPassword) return res.status(400).send({status:false,msg:'Password is incorrect.'});
    const token = jwt.sign({authorId:author._id},process.env.USER_TOKEN,{expiresIn:'1d'});
    
    res.status(200).send({status:true,msg:'You are Successfully logged in.',token:token,id:author._id});


  }catch(err){
    errorHandle(err,res);
  }
} 

exports.getAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.status(200).send({status:true,author});
  } catch (err) {
    res.status(500).send({status:false,msg:err.message});
  }
};


exports.showAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).send(authors);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
