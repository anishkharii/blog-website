const express = require('express');
const {addAuthor, showAuthors, verifyAuthor, loginAuthor, getAuthor} = require('../controllers/authorController');
const {addBlog, showBlogs, updateBlog, deleteBlogById, deleteBlogsByQuery} = require('../controllers/blogController');
const {authorValidation} = require('../middleware/authorValidation');
const { verifyAdmin } = require('../middleware/adminVerification');

const multer = require('multer');

const upload = multer({storage:multer.diskStorage({})})

const router = express.Router();

router.post('/add-author',upload.single("image"),authorValidation,verifyAdmin,addAuthor);
router.post('/verify-author/:userId',verifyAuthor);
router.get('/authors',showAuthors);
router.get('/author/:id',getAuthor);
router.post("/login",upload.single(),loginAuthor);

router.get('/blogs',showBlogs);
router.post('/blogs',addBlog);
router.put('/blogs/:blogId', updateBlog);
router.delete('/blogs/:blogId',deleteBlogById);
router.delete('/blogs',deleteBlogsByQuery);

router.all('*',(req,res)=>{res.status(404).send("Route not found")})
module.exports = router;