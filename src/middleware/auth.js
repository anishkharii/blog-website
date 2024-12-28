const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Blog = require("../models/blogModel");

const authToken = async(req, res, next) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) {
    return res
      .status(401)
      .send({ status: false, msg: "Unauthorized: No token provided." });
  }

  const token = authHeaders.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .send({ status: false, msg: "Unauthorized: Token format is invalid." });
  }

  let userId;
  if (req.query && req.query.id) {
    userId = req.query.id;
  } else if (req.body && req.body.id) {
    userId = req.body.id;
  } else if (req.params && req.params.id) {
    userId = req.params.id;
  } else {
    return res
      .status(400)
      .send({ status: false, msg: "Bad Request: User Id not provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.USER_TOKEN);
    if (decoded.id !== userId) {
      return res
        .status(401)
        .send({
          status: false,
          msg: "Forbidden: Token Id and user Id not matched.",
        });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .send({ status: false, msg: "Unauthorized: User not found." });
    }
    req.id = decoded.id;
    req.role = user.role;
    next();
  } catch (err) {
    console.error("Token Decode Error:", err);
    return res
      .status(401)
      .send({ status: false, msg: "Unauthorized: Invalid token." });
  }
};

const authorizeRole = (roles) => {
  return async (req, res, next) => {
    console.log(req.role, req.id);
    if (!roles.includes(req.role)) {
      return res
        .status(403)
        .send({ status: false, msg: "Forbidden: User role not authorized." });
    }
    next();
  };
};

const authBlogOwner = async (req, res, next) => {

    try{
        const blogId = req.params.id;
        const userId = req.id;

        const blog = await Blog.findById(blogId);
        if(!blog) return res.status(404).send({status:false,msg:"No Blog Found"});

        if(blog.userId != userId && req.role != "admin") return res.status(403).send({status:false,msg:"Forbidden: User not authorized."});
        next();
    }catch(err){
        errorHandle(err,res);

    }
};

module.exports = { authToken, authorizeRole, authBlogOwner };
