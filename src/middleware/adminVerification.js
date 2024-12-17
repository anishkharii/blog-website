const { errorHandle } = require("../errorhandling/errorhandling");
const User = require("../models/userModel");
const { verificationOtp } = require("../nodemailer/mailsender");
const bcrypt = require("bcrypt");

exports.verifyAdmin = async (req, res, next) => {
  try {
    if (req.body.role !== "admin") {
      return next();
    } 
      const data = req.body;
      const randomOtp = Math.floor(1000 + Math.random() * 9000);

      const user = await User.findOneAndUpdate({ email: data.email },{$set:{otp:randomOtp}});
      
      if (user && user.isVerified) {
        return res.status(400).send({
          status: false,
          msg: "User already verified.",
        });
      }
      if (user && !user.isVerified) {
        const name = `${user.fname} ${user.lname}`;
        const email = "anishkhari558@gmail.com";
        verificationOtp(email, name, randomOtp);
        return res
          .status(200)
          .send({
            status: true,
            msg: "Otp is sended to admin mail please verify it.",
            data:{

              id: user._id
            }
          });
      }
      const hashPassword = await bcrypt.hash(data.password, 10);
      data.password = hashPassword;
      data.otp = randomOtp;
      data.role=data.role.toLowerCase();
      const newUser = await User.create(data);
      verificationOtp("anishkhari558@gmail.com", data.fname+" "+data.lname, randomOtp);
      return res
        .status(200)
        .send({
          status: true,
          msg: "Otp is sended to admin mail please verify it.",
          data:{

            id: newUser._id
          }
        });
    

    // else{
    //   return res.status(400).send({status:false,msg:"Access Denied"});
    // }
  } catch (err) {
    errorHandle(err,res);
  }
  next();
};
