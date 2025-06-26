const express = require('express');
const router = express.Router();

const  isLogin = require('../middleware/isLogin')
const isAdmin = require('../middleware/isAdmin')

const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryContoller');
const articleController = require('../controllers/articleController');
const commentsController = require('../controllers/commentsController');
// const authController = require('../controllers/authController');

// Auth routes
router.get("/", userController.loginPage);
router.post("/index", userController.adminLogin);
router.get("/logout", userController.Logout);
router.get("/dashboard",isLogin, userController.dashboard);
router.get("/settings", isLogin, isAdmin, userController.settings);

// User routes
router.get("/users", isLogin, userController.allUser);
router.get("/add-user", isLogin, userController.addUserPage);
router.post("/add-user", isLogin, userController.addUser);
router.get("/update-user/:id", isLogin, userController.updateUserPage);
router.post("/update-user/:id", isLogin, userController.updateUser);
router.get("/delete-user/:id", isLogin, userController.deleteUser);

// // Category routes
router.get("/category", isLogin, categoryController.allCategory);
router.get("/add-category",isLogin,  categoryController.addCategoryPage);
router.post("/add-category", isLogin, categoryController.addCategory);
router.get("/update-category/:id", isLogin, categoryController.updateCategoryPage);
router.post("/update-category/:id", isLogin, categoryController.updateCategory);
router.post("/delete-category/:id", isLogin, categoryController.deleteCategory);

// // Article routes
router.get("/article", isLogin, articleController.allArticle);
router.get("/add-article", isLogin, articleController.addArticlePage);
router.post("/add-article", isLogin, articleController.addArticle);
router.get("/update-article/:id", isLogin, articleController.updateArticlePage);
router.post("/update-article/:id", isLogin, articleController.updateArticle);
router.post("/delete-article/:id", isLogin, articleController.deleteArticle);


// // Cooments routes
router.get("/comments", isLogin, commentsController.allComments);
router.get("/add-comments", isLogin, commentsController.addCommentsPage);
router.post("/add-comments", isLogin, commentsController.addComments);
router.get("/update-comments/:id", isLogin, commentsController.updateCommentsPage);
router.post("/update-comments/:id", isLogin, commentsController.updateComments);
router.post("/delete-comments/:id", isLogin, commentsController.deleteComments);



module.exports =  router;
