const categoryModel = require('../models/categoryModel');
const newsModel = require('../models/newsModel');
const userModel = require('../models/userModel');

const allArticle = async (req, res) => {
    res.render('admin/articals');
};
const addArticlePage = async (req, res) => {
    res.render('admin/articals/create');
};
const addArticle = async (req, res) => {};
const updateArticlePage = async (req, res) => {
    res.render('admin/articals/update');
};
const updateArticle = async (req, res) => {};
const deleteArticle = async (req, res) => {};

module.exports ={
    allArticle,
    addArticlePage,
    addArticle,
    updateArticlePage,
    updateArticle,
    updateArticle,
    deleteArticle,
}