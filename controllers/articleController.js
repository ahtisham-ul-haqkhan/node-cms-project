const categoryModel = require('../models/categoryModel');
const newsModel = require('../models/newsModel');
const userModel = require('../models/userModel');
const createError = require('../utils/error-message')
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

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
const addArticle = async (req, res, next) => {
    try {
    const categories = await categoryModel.find();

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return  res.render('admin/articals/create', {
                categories: categories,
                errors: errors.array()
            });
        }
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
        next(error);
        // console.error("Add Article Error:", error);
        // res.status(500).send(error.message);
    }
};




const updateArticlePage = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(createError('Invalid Article ID Format', 404));
        }

        const article = await newsModel.findById(id)
            .populate('category', 'name')
            .populate('author', 'fullname');

        if (!article) {
            return next(createError('Article Not Found', 404));
        }

        const categories = await categoryModel.find();

        if (req.role === 'author' && req.id != article.author._id.toString()) {
            return res.status(401).send("Unauthorized");
        }

        res.render('admin/articals/update', { article, categories, error: 0 });

    } catch (error) {
        next(error); // goes to 500 handler
    }
};
const updateArticle = async (req, res, next) => {
    try {

        const errors = validationResult(req);
        const { id } = req.params;

        if (!errors.isEmpty()) {
            const categories = await categoryModel.find();
            const article = await newsModel.findById(id);
            return  res.render('admin/articals/update', {
                categories: categories,
                article: { ...req.body, _id: article._id, image: article.image},
                errors: errors.array()
            });
        }
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
            const imagePath = path.join(__dirname, '../public/uploads', article.image);
            fs.unlinkSync(imagePath)
            article.image = req.file.filename;
        }

        await article.save();
        res.redirect('/admin/article');

    } catch (error) {
        next(error);
        // console.error("Update Article Error:", error);
        // res.status(500).send(error.message);
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

        // if (article.file) {
        //     const imagePath = path.join(__dirname, '../public/uploads', article.image);
        //     fs.unlinkSync(imagePath)
        //     article.image = req.file.filename;
        // }

        await newsModel.deleteOne({ _id: id });
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