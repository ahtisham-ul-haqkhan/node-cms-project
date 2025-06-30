const categoryModel = require('../models/categoryModel');
const newsModel = require('../models/newsModel');
const userModel = require('../models/userModel');

const allArticle = async (req, res) => {
    let articles
    if(req.role === 'admin') {
         articles = await newsModel.find().populate('category', 'name').populate('author', 'fullname');
    } else {
         articles = await newsModel.find({author: req.id}).populate('category', 'name').populate('author', 'fullname');
    }
    res.render('admin/articals', { articles });
};
const addArticlePage = async (req, res) => {
    const categories = await categoryModel.find();
    res.render('admin/articals/create', { categories });
};
const addArticle = async (req, res) => {
    try {
        const { title, content, category } = req.body;

        if (!req.file) {
            throw new Error("Image not uploaded properly.");
        }

        if (!category) {
            throw new Error("Category is required.");
        }

        const article = await newsModel.create({
            title,
            category,
            content,
            author: req.id, 
            image: req.file.filename,
        });

        res.redirect('/admin/article');
    } catch (error) {
        console.error("Add Article Error:", error);
        res.status(500).send(error.message);
    }
};



const updateArticlePage = async (req, res) => {
    const article = await newsModel.findById(req.params.id)
                                                            .populate('category', 'name')
                                                            .populate('author', 'fullname');
    const categories = await categoryModel.find();

    if(req.role == 'author') {
        if(req.id != article.author._id) {

            return res.status(401).send("Unauthorized");
        }
    }
    res.render('admin/articals/update', { article , categories});
};
const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category } = req.body;

        const article = await newsModel.findById(id);
        if (!article) {
            return res.status(404).send("Article Not Found");
        }
        if(req.role == 'author') {
            if(req.id != article.author._id) {
                return res.status(401).send("Unauthorized");
            }
        }
        article.title = title || article.title;
        article.content = content || article.content;
        article.category = category || article.category;

        if (req.file) {
            article.image = req.file.filename;
        }

        await article.save();
        res.redirect('/admin/article');

    } catch (error) {
        console.error("Update Article Error:", error);
        res.status(500).send(error.message);
    }
};

const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await newsModel.findById(id);
        if(req.role == 'author') {
            if(req.id != article.author._id) {
                return res.status(401).send("Unauthorized");
            }
        }

        await newsModel.deleteOne(id);
        res.redirect('/admin/artilce');
    } catch (error) {
        console.error("Add Article Error:", error);
        res.status(500).send(error.message);
    }
};

module.exports ={
    allArticle,
    addArticlePage,
    addArticle,
    updateArticlePage,
    updateArticle,
    updateArticle,
    deleteArticle,
}