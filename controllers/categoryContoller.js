const categoryModel = require('../models/categoryModel');
const newsModel = require('../models/newsModel');
const createError = require('../utils/error-message')
const { validationResult } = require('express-validator');

const allCategory = async(req,res) => {
    const categories = await categoryModel.find();
    res.render('admin/categories', {categories});
}
const addCategoryPage = async(req,res) => {
    res.render('admin/categories/create');
}
const addCategory = async(req,res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return  res.render('admin/categories/create', {
                errors: errors.array()
            });
        }
        const {name, description} = req.body;
        const category = await categoryModel.create({
            name,
            description,
        })
        res.redirect('/admin/category');
    } catch (error) {
        next(error); // goes to 500 handler
        // console.error(error);
        // res.status(500).send('Internal Server Error');
    }
}
const updateCategoryPage = async(req,res,next) => {
    try {
        const {id} = req.params;
    const category = await categoryModel.findById(id);
    if(!category)
    {
        return next(createError('Category Not Found', 404))
    }
    res.render('admin/categories/update', { category,  errors: 0 });
    } catch (error) {
        next(error)
    }
}
const updateCategory = async(req,res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return  res.render('/admin/categories/update', {
                category: req.body,
                errors: errors.array()
            });
        }
        const { id } = req.params;
        const {name, description} = req.body;
        const category = await categoryModel.findById(id);

        category.name = name || category.name;
        category.description = description || category.description;

        await category.save();


        res.redirect("/admin/category");
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}


const deleteCategory = async(req,res, next) => {
    try {
        const { id } = req.params;

        const category = await categoryModel.findById(id); 
        if(!category) {
            return next(createError("Category not found", 404));
        }

        const article = await newsModel.findOne({category: id})
        if(article) {
            return res.status(400).json({success: false, message: 'Category is assigned to news articles and cannot be deleted.'});
            // return next(createError("Category has news", 400));
        }

        await categoryModel.deleteOne({ _id: id });

        res.redirect("/admin/category");
    } catch (error) {
        next(error);
    }
}


module.exports = {
    allCategory,
    addCategoryPage,
    addCategory,
    updateCategoryPage,
    updateCategory,
    deleteCategory
};

