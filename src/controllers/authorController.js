const Author = require("../models/authorModel");
const { errorHandle } = require("../errorhandling/errorhandling");
const { verificationOtp } = require("../nodemailer/mailsender");
const { uploadImage } = require("../Cloudinary/imgHandler");
const {
  firstName,
  lastName,
  Validemail,
  Validpass,
} = require("../validation/Authorvalid");


exports.addAuthor = async (req, res) => {
  try {
    const data = req.body;

    const author = await Author.findOne({ email: data.email });
    if (author) {
      return res.status(200).send("User already exists");
    }
    let isTrue = true;
    if (!firstName(data.fname)) isTrue = false;
    if (!lastName(data.lastName)) isTrue = false;
    if (!Validemail(data.email)) isTrue = false;
    if (!Validpass(data.password)) isTrue = false;

    if (!isTrue) {
      return res.status(400).send("Wrong credentials");
    }

    const img = req.file;
    const img_url = await uploadImage(img.path);
    const randomOtp = Math.floor(1000 + Math.random() * 9000);
    req.body.otp = randomOtp;
    req.body.image = img_url;

    const newAuthor = await Author.create(data);

    const Name = ` ${newAuthor.fname} ${newAuthor.lname}`;
    const email = newAuthor.email;
    verificationOtp(email, Name, randomOtp);
    res.status(201).send({ status: true, newAuthor });
  } catch (err) {
    errorHandle(err, res);
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
