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
    const category = await categoryModel.findById(req.params.id);
    res.render('admin/categories/update', { category });
}
const updateCategory = async(req,res) => {
    try {
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


const deleteCategory = async(req,res) => {
    try {
        const {id } = req.params;
        const category = await categoryModel.findByIdAndDelete(id); 

        res.redirect("/admin/category");
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

