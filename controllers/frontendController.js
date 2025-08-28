const mongoose = require('mongoose');

const categoryModel = require('../models/categoryModel');
const newsModel = require('../models/newsModel');
const userModel = require('../models/newsModel');
const commentsModel = require('../models/commentModel');
const settingModel = require("../models/settingModel");
const paginate = require("../utils/paginate");
const createError = require('../utils/error-message');



const index = async (req,res) => {

  const paginatedNews = await paginate(newsModel, {}, 
                                      req.query, {
                                      populate: [
                                        { path: 'category', select: 'name slug' },
                                        { path: 'author', select: 'fullname' }
                                      ],   
                                      sort: '-createdAt' })

  // res.json({ paginatedNews })
  res.render('index', { paginatedNews , query: req.query})
 }
const articleByCategories = async (req,res, next) => {
  const category = await categoryModel.findOne({ slug: req.params.name });
  if (!category) {
    return next(createError('Category Not Found', 404));
  }
  const paginatedNews = await paginate(newsModel, { category: category._id }, 
                                      req.query, {
                                      populate: [
                                        { path: 'category', select: 'name slug' },
                                        { path: 'author', select: 'fullname' }
                                      ],   
                                      sort: '-createdAt' })

  res.render('category', { paginatedNews, category, query: req.query })
 }

const singleArticle = async (req,res, next) => { 
  const singleNews = await newsModel.findById(req.params.id)
                        .populate('category',{'name':1, 'slug':1})
                        .populate('author','fullname')
                        .sort({createdAt: -1})

        if(!singleNews) return next(createError('Article Not Found', 404));
  const comments = await commentsModel.find({article: req.params.id, status: "approved"}).sort({createdAt: -1});
  res.render('single', { singleNews, comments })
}

const search = async (req,res) => {
  const searchQuery = req.query.search

  const paginatedNews = await paginate(newsModel, {
                              $or: [
                                { title: { $regex: searchQuery, $options: 'i' } },
                                { content: { $regex: searchQuery, $options: 'i' } }
                              ]
                            }, 
                            req.query, {
                            populate: [
                              { path: 'category', select: 'name slug' },
                              { path: 'author', select: 'fullname' }
                            ],   
                            sort: '-createdAt' })


  res.render('search', { paginatedNews, searchQuery, query: req.query })
 }
const author = async (req,res, next) => { 
    const id = req.params.name;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('Invalid author ID');
    }
  const author = await userModel.findById(id);
    // if (!author) {
    //   return res.status(404).send('Author not found');
    // }

    const paginatedNews = await paginate(newsModel, { author: req.params.name  }, 
                                      req.query, {
                                      populate: [
                                        { path: 'category', select: 'name slug' },
                                        { path: 'author', select: 'fullname' }
                                      ],   
                                      sort: '-createdAt' })

  // const news = await newsModel.find({ author: req.params.name })
  //                       .populate('category',{'name':1, 'slug':1})
  //                       .populate('author','fullname')
  //                       .sort({createdAt: -1})
  // const categoriesInUse = await newsModel.distinct('category')   
  // const categories = await categoryModel.find({'_id':{$in:categoriesInUse}}) 

  // res.render('author', { news, categories, author })
   res.render('author', { paginatedNews, author, query: req.query })
}
const addComment = async (req,res, next) => { 
  try {
    const {name, email, content, } = req.body;
    const comment = new commentsModel({
        name,
        email,
        content,
        article: req.params.id
    });
    await comment.save();

    res.redirect('/single/' + req.params.id);
  } catch {
       return next(createError('Error Add Comment', 404));

  }
}

const testing = async (req,res) => {
  // res.send('This is long String' .repeat(500000))
  const news = await commentsModel.find();
  res.json(news);
}

module.exports = {
  index,
  articleByCategories,
  singleArticle,
  search,
  author,
  addComment,
  testing
}