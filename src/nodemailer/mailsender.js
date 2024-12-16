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
            from: '"Tech Tales" <your-email@gmail.com>', 
            to:email, 
            subject: "Your Email OTP to verify your account - Tech Tales",
            
            html: `
           <body
    style="margin: 0; padding: 0; background-color: #121212; color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;">
    <div
        style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1e1e1e; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); text-align: center; border: 1px solid #333333;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h1>Tech Tales</h1>
        </div>
        <div
            style="font-size: 28px; font-weight: bold; margin-bottom: 20px; color: #d4af37; text-transform: uppercase; letter-spacing: 1.5px;">
            Your OTP Code</div>
        <div style="margin: 20px 0; text-align: center;">
            <p style="margin: 10px 0; font-size: 14px; color: #bbbbbb; text-align: left;margin:10px;">Hello ${name},</p>
            <p style="margin: 10px 0; font-size: 14px; color: #bbbbbb;">Please use the One-Time Password (OTP) below to
                proceed. The OTP is valid for the next 10 minutes.</p>
            <div
                style="display: inline-block; font-size: 48px; font-weight: bold; background-color: #2b2b2b; color: #d4af37; padding: 20px 40px; border-radius: 10px; letter-spacing: 10px; margin: 20px 0; text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);">
                ${otp}</div>
            <p style="margin: 10px 0; font-size: 14px; color: #bbbbbb;">If you did not request this, you can safely
                ignore this email.</p>
        </div>
        <div
            style="margin-top: 30px; font-size: 12px; color: #aaaaaa; border-top: 1px solid #333333; padding-top: 20px;">
            <p style="margin: 5px 0;">Need help? <a href="#/"
                    style="color: #bbbbbb; text-decoration: none; font-size: 12px;">Contact Support</a></p>
        </div>
    </div>
</body>
            `,
        });

        console.log(`Message sent: ${info.messageId}`);

    }catch(err){
        console.log(err.message);
    }
}

