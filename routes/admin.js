const express = require('express');
const router = express.Router();

const  isLogin = require('../middleware/isLogin')
const isAdmin = require('../middleware/isAdmin')
const upload = require('../middleware/multer.js')
const isValid = require("../middleware/validation.js")

const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryContoller');
const articleController = require('../controllers/articleController');
const commentsController = require('../controllers/commentsController');
// const authController = require('../controllers/authController');

// Auth routes
router.get("/", userController.loginPage);
router.post("/index", isValid.loginValidation,  userController.adminLogin);
router.get("/logout", userController.Logout);
router.get("/dashboard",isLogin, userController.dashboard);
router.get("/settings", isLogin, isAdmin, userController.settings);
router.post("/save-settings", isLogin, isAdmin, upload.single('website_logo'), userController.saveSettings);

// User routes
router.get("/users", isLogin, userController.allUser);
router.get("/add-user", isLogin, userController.addUserPage);
router.post("/add-user", isLogin, isValid.userValidation, userController.addUser);
router.get("/update-user/:id", isLogin, userController.updateUserPage);
router.post("/update-user/:id", isLogin, isValid.userUpdateValidation, userController.updateUser);
router.get("/delete-user/:id", isLogin, userController.deleteUser);

// // Category routes
router.get("/category", isLogin, categoryController.allCategory);
router.get("/add-category",isLogin,  categoryController.addCategoryPage);
router.post("/add-category", isLogin, isValid.categoryValidation, categoryController.addCategory);
router.get("/update-category/:id", isLogin, categoryController.updateCategoryPage);
// router.post("/category-update/:id", isLogin, categoryController.updateCategory);
router.post("/update-category/:id", isLogin, isValid.categoryValidation, categoryController.updateCategory);
router.get("/delete-category/:id", isLogin, categoryController.deleteCategory);

// // Article routes
router.get("/article", isLogin, articleController.allArticle);
router.get("/add-article", isLogin, articleController.addArticlePage);
router.post('/add-article', isLogin, upload.single('image'),  isValid.articleValidation, articleController.addArticle);
router.get("/update-article/:id", isLogin, articleController.updateArticlePage);
router.post("/update-article/:id", isLogin, upload.single('image'), isValid.articleValidation, articleController.updateArticle);
router.get("/delete-article/:id", isLogin, articleController.deleteArticle);


// // Cooments routes
router.get("/comments", isLogin, commentsController.allComments);
router.put("/update-comments-status/:id", isLogin, commentsController.updateCommentStatus);
router.get("/add-comments", isLogin, commentsController.addCommentsPage);
router.post("/add-comments", isLogin, commentsController.addComments);
router.get("/update-comments/:id", isLogin, commentsController.updateCommentsPage);
router.post("/update-comments/:id", isLogin, commentsController.updateComments);
router.post("/delete-comments/:id", isLogin, commentsController.deleteComments);

// 404 Middlewar

router.use(isLogin,(req,res, next) => {
    res.status(404).render('admin/404', {
        role: req.role || res.locals.role, 
        message: "Page Not Found",
    })

});

// 500 Error Handler (for internal errors)
router.use(isLogin, (err, req, res, next) => {
    console.error(err.stack);

    const status = err.status || 500;
    let view;
    switch(status) {
        case 404:
        view = "admin/404"
        break;
        case 500:
        view = "admin/500"
        break;
        default:
            view = "admin/500"; 

    }
    // const view = status === 404 ? 'admin/404' : 'admin/500';
    res.status(status).render(view, {
        role: req.role || res.locals.role || 'guest', // fallback to avoid undefined
        message: err.message || "Something went wrong",
    });
});

module.exports =  router;
