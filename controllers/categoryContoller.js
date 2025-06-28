const categoryModel = require('../models/categoryModel');

const allCategory = async(req,res) => {
    const categories = await categoryModel.find();
    res.render('admin/categories', {categories});
}
const addCategoryPage = async(req,res) => {
    res.render('admin/categories/create');
}
const addCategory = async(req,res) => {
    try {
        const {name, description} = req.body;
        const category = await categoryModel.create({
            name,
            description,
        })
        res.redirect('/admin/category');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
const updateCategoryPage = async(req,res) => {
    res.render('admin/categories/update');
}
const updateCategory = async(req,res) => {}
const deleteCategory = async(req,res) => {
    try {
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
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

