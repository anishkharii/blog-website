
const express = require('express');
const {
    addUser,
    verifyUser,
    loginUser,
    getAllUsers,
    forgotPasswordStep1,
    forgotPasswordStep2,
    wakeUp,
    getUser,
    updateUser,
    getUserName,
    deleteUser
} = require('../controllers/userController');
const {
    addBlog,
    showAllBlogs,
    updateBlog,
    deleteBlogById,
    deleteBlogsByQuery,
    showBlog
} = require('../controllers/blogController');
const { userValidation } = require('../middleware/userValidation');
const {authToken, authorizeRole, authBlogOwner} = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ storage: multer.diskStorage({}) });
const router = express.Router();


// --- HEALTH CHECK ---
router.get('/wakeUp', wakeUp);

// --- USER ROUTES ---
router.route('/users')
    .get(authToken, authorizeRole(['admin']), getAllUsers) 
    .post(userValidation, addUser);


router.post('/users/verify/:id', verifyUser);
router.post('/login', loginUser);
router.get('/forgot-password/:email', forgotPasswordStep1); 
router.put('/forgot-password/:id', forgotPasswordStep2);

router.route('/users/:id')
    .get(authToken, getUser)
    .put(authToken, upload.single('image'), updateUser)
    .delete(authToken, authorizeRole(['admin']), deleteUser);

router.get('/users/:id/name', getUserName);


// --- BLOG ROUTES ---
router.route('/blogs')
    .get(showAllBlogs) 
    .post(authToken, authorizeRole(['admin','author']), addBlog) 
    .delete(authToken, authorizeRole(['admin']), deleteBlogsByQuery); 
router.route('/blogs/:id')
    .get(showBlog)
    .put(authToken, authorizeRole(['admin','author']), authBlogOwner, updateBlog)
    .delete(authToken, authorizeRole(['admin','author']), authBlogOwner, deleteBlogById);

// ---  CATCH ALL ROUTE ---
router.all('*', (req, res) => { res.status(404).send("Route not found") });

module.exports = router;