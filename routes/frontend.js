const express = require('express')
const frontendController = require('../controllers/frontendController')
const loadCommonData = require('../middleware/loadCommanData')
const frontendRouter = express.Router();

frontendRouter.use(loadCommonData);
frontendRouter.get("/", frontendController.index);
frontendRouter.get("/category/:name", frontendController.articleByCategories);
frontendRouter.get("/single/:id", frontendController.singleArticle);
frontendRouter.get("/search", frontendController.search);
frontendRouter.get("/author/:name", frontendController.author);
frontendRouter.post("/single/:id/comment", frontendController.addComment); // <- post instead of get

module.exports =  frontendRouter;
