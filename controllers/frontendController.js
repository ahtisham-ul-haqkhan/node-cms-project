const mongoose = require('mongoose');

const categoryModel = require('../models/categoryModel');
const newsModel = require('../models/newsModel');
const userModel = require('../models/newsModel');
const commentsModel = require('../models/commentModel');


const index = async (req,res) => {
        res.render('index');
}

const articleByCategories = async (req,res) => {
    try {
        res.render('category');
    } catch (error) {
        
    }
}

const singleArticle = async (req,res) => {
    try {
        res.render('single');
    } catch (error) {
        
    }
}

const search = async (req,res) => {
    try {
        res.render('search');
    } catch (error) {
        
    }
}

const author = async (req,res) => {
    try {
        res.render('author');
    } catch (error) {
        
    }
}

const addComment = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = {
    index,
    articleByCategories,
    singleArticle,
    search,
    author,
    addComment
};
