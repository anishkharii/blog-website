const { errorHandle } = require("../errorhandling/errorhandling");
const Author = require("../models/authorModel");
const { verificationOtp } = require("../nodemailer/mailsender");
const bcrypt = require("bcrypt");

exports.verifyAdmin = async (req, res, next) => {
  try {
    if (req.body.role.toLowerCase() !== "admin") {
      return next();
    } 
      const data = req.body;
      const randomOtp = Math.floor(1000 + Math.random() * 9000);

      const author = await Author.findOneAndUpdate({ email: data.email },{$set:{otp:randomOtp}});
      
      if (author && author.isVerified) {
        return res.status(400).send({
          status: false,
          msg: "Author already verified.",
        });
      }
      if (author && !author.isVerified) {
        const name = `${author.fname} ${author.lname}`;
        const email = "anishkhari558@gmail.com";
        verificationOtp(email, name, randomOtp);
        return res
          .status(200)
          .send({
            status: true,
            msg: "Otp is sended to admin mail please verify it.",
            data:{

              id: author._id
            }
          });
      }
      const hashPassword = await bcrypt.hash(data.password, 10);
      data.password = hashPassword;
      data.otp = randomOtp;
      data.role=data.role.toLowerCase();
      const newAuthor = await Author.create(data);
      verificationOtp("anishkhari558@gmail.com", data.fname+" "+data.lname, randomOtp);
      return res
        .status(200)
        .send({
          status: true,
          msg: "Otp is sended to admin mail please verify it.",
          data:{

            id: newAuthor._id
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
