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
frontendRouter.post("/single/:id/comment", frontendController.addComment);

frontendRouter.get("/testing", frontendController.testing);


// 500 Error Handler (for internal errors)
frontendRouter.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
 
    res.status(status).render('errors', {
        message: err.message || "Something went wrong",
        status:status
    });
});

module.exports =  frontendRouter;
