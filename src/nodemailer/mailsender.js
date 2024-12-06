const nodemailer = require("nodemailer");
require('dotenv').config();


const transporter = nodemailer.createTransport({
  service:'gmail',
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user:process.env.NODEMAILER_USERNAME,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

exports.verificationOtp = async(email, name, otp)=>{
    try{
        const info = await transporter.sendMail({
            from: '"Ravi Singh 👻😊💕😊" <your-email@gmail.com>', 
            to:email, 
            subject: "Your Email OTP to Reset Password on MoviesAll",
            
            html: `
            <div style="background-color:#16253D;padding:20px;color:#fff;font-family:Arial, sans-serif;border-radius:10px;">
                <h2 style="color:#FF4500;">MoviesAll</h2>
                <p>Hi ${name},</p>
                <p>Please find your One Time Password (OTP) for reset password below:</p>
                <div style="background-color:#fff;color:#000;font-size:24px;font-weight:bold;text-align:center;padding:10px;margin:20px 0;border-radius:5px;">
                    ${otp}
                </div>
                <p>The OTP is valid for 5 minutes.</p>
                <p>For account safety, do not share your OTP with others.</p>
                <br>
                <p>Regards,</p>
                <p>Team MoviesAll</p>
            </div>
            `,
        });

        console.log(`Message sent: ${info.messageId}`);

    }catch(err){
        console.log(err.message);
    }
}