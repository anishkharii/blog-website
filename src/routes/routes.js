const express = require('express');
const {addAuthor, showAuthors} = require('../controllers/authorController');
const {addBlog, showBlogs, updateBlog, deleteBlogById, deleteBlogsByQuery} = require('../controllers/blogController');
const multer = require('multer');

const upload = multer({storage:multer.diskStorage({}),})

const router = express.Router();

router.post('/CreateAuthors',upload.single("image"),addAuthor);
router.get('/authors',showAuthors);

router.get('/blogs',showBlogs);
router.post('/blogs',addBlog);
router.put('/blogs/:blogId', updateBlog);
router.delete('/blogs/:blogId',deleteBlogById);
router.delete('/blogs',deleteBlogsByQuery);
module.exports = router;