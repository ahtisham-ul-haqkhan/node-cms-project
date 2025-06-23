const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryContoller');
const articleController = require('../controllers/articleController');
const commentsController = require('../controllers/commentsController');
const authController = require('../controllers/authController');

// Auth routes
router.get("/", authController.loginPage);
router.post("/index", authController.adminLogin);
router.get("/logout", authController.Logout);

// User routes
router.get("/users", userController.allUser);
router.get("/add-user", userController.addUserPage);
router.post("/add-user", userController.addUser);
router.get("/update-user/:id", userController.updateUserPage);
router.post("/update-user/:id", userController.updateUser);
router.post("/delete-user/:id", userController.deleteUser);

// Category routes
router.get("/category", categoryController.allCategory);
router.get("/add-category", categoryController.addCategoryPage);
router.post("/add-category", categoryController.addCategory);
router.get("/update-category/:id", categoryController.updateCategoryPage);
router.post("/update-category/:id", categoryController.updateCategory);
router.post("/delete-category/:id", categoryController.deleteCategory);

// Article routes
router.get("/article", articleController.allArticle);
router.get("/add-article", articleController.addArticlePage);
router.post("/add-article", articleController.addArticle);
router.get("/update-article/:id", articleController.updateArticlePage);
router.post("/update-article/:id", articleController.updateArticle);
router.post("/delete-article/:id", articleController.deleteArticle);


// Cooments routes
router.get("/comments", commentsController.allComments);
router.get("/add-comments", commentsController.addCommentsPage);
router.post("/add-comments", commentsController.addComments);
router.get("/update-comments/:id", commentsController.updateCommentsPage);
router.post("/update-comments/:id", commentsController.updateComments);
router.post("/delete-comments/:id", commentsController.deleteComments);


export default router;
