const express = require('express');
const {addUser, verifyUser, loginUser, getUser, getAllUsers} = require('../controllers/userController');
const {addBlog, showBlogs, updateBlog, deleteBlogById, deleteBlogsByQuery} = require('../controllers/blogController');
const {userValidation} = require('../middleware/userValidation');
const { verifyAdmin } = require('../middleware/adminVerification');
const loginAuth = require('../middleware/loginAuth');
const multer = require('multer');
const adminAuth = require('../middleware/adminAuth');

const upload = multer({storage:multer.diskStorage({})})

const router = express.Router();

router.post('/add-user',upload.single("image"),userValidation,verifyAdmin,addUser);
router.post('/verify-user/:userId',verifyUser);
router.get('/users/:id',adminAuth, getAllUsers);
router.get('/user/:id', loginAuth, getUser);
router.post("/login",upload.single(),loginUser);

router.get('/blogs',showBlogs);
router.post('/blogs',addBlog);
router.put('/blogs/:blogId', updateBlog);
router.delete('/blogs/:blogId',deleteBlogById);
router.delete('/blogs',deleteBlogsByQuery);

router.all('*',(req,res)=>{res.status(404).send("Route not found")});
module.exports = router;