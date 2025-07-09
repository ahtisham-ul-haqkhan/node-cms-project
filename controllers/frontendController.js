const mongoose = require('mongoose');

const categoryModel = require('../models/categoryModel');
const newsModel = require('../models/newsModel');
const userModel = require('../models/newsModel');
const commentsModel = require('../models/commentModel');

const index = async (req,res) => {
  const news = await newsModel.find()
                        .populate('category',{'name':1, 'slug':1})
                        .populate('author','fullname')
                        .sort({createdAt: -1})

  const categoriesInUse = await newsModel.distinct('category')   
  const categories = await categoryModel.find({'_id':{$in:categoriesInUse}})                   
//   res.json({ news, categories })
  res.render('index', { news, categories })
 }


const articleByCategories = async (req,res) => {
  const category = await categoryModel.findOne({ slug: req.params.name });

  if (!category) {
    return res.status(404).send('Category not found');
  }

  const news = await newsModel.find({ category: category._id })
                        .populate('category',{'name':1, 'slug':1})
                        .populate('author','fullname')
                        .sort({createdAt: -1})

  const categoriesInUse = await newsModel.distinct('category')   
  const categories = await categoryModel.find({'_id':{$in:categoriesInUse}})   

  res.render('category', { news, categories, category })
 }

const singleArticle = async (req,res) => { 
  const singleNews = await newsModel.findById(req.params.id)
                        .populate('category',{'name':1, 'slug':1})
                        .populate('author','fullname')
                        .sort({createdAt: -1})

  const categoriesInUse = await newsModel.distinct('category')   
  const categories = await categoryModel.find({'_id':{$in:categoriesInUse}}) 

  res.render('single', { singleNews, categories })
}

const search = async (req,res) => {
  const searchQuery = req.query.search

  const news = await newsModel.find({
                      $or: [
                        { title: { $regex: searchQuery, $options: 'i' } },
                        { content: { $regex: searchQuery, $options: 'i' } }
                      ]
                    })
                    .populate('category',{'name':1, 'slug':1})
                    .populate('author','fullname')
                    .sort({createdAt: -1})

  const categoriesInUse = await newsModel.distinct('category')   
  const categories = await categoryModel.find({'_id':{$in:categoriesInUse}}) 

  res.render('search', { news, categories, searchQuery })
 }

 
const author = async (req,res) => { 
    const id = req.params.name;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('Invalid author ID');
    }
  const author = await userModel.findById(id);
    // if (!author) {
    //   return res.status(404).send('Author not found');
    // }

  const news = await newsModel.find({ author: req.params.name })
                        .populate('category',{'name':1, 'slug':1})
                        .populate('author','fullname')
                        .sort({createdAt: -1})
  const categoriesInUse = await newsModel.distinct('category')   
  const categories = await categoryModel.find({'_id':{$in:categoriesInUse}}) 

  res.render('author', { news, categories, author })
}
const addComment = async (req,res) => { }

module.exports = {
  index,
  articleByCategories,
  singleArticle,
  search,
  author,
  addComment
}