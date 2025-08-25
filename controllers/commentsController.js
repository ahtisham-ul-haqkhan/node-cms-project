const commentsModel = require('../models/commentModel');
const createError = require('../utils/error-message');
const newsModel = require('../models/newsModel');



const allComments = async (req, res, next) => {
    try {
        let comments;

        if (req.role === 'admin') {
            comments = await commentsModel.find()
                .populate('article', 'title')
                .sort({ createdAt: -1 });
        } else {
            const news = await newsModel.find({ author: req.id });
            const newsIds = news.map(news => news._id);
            comments = await commentsModel.find({ article: { $in: newsIds } })
                .populate('article', 'title')
                .sort({ createdAt: -1 });
        }

        res.render('admin/comments', { comments, role: req.role });
    } catch (error) {
        next(error);
    }
};


const updateCommentStatus = async (req,res,next) => { 
  try {
    const comment = await commentsModel.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if(!comment){
      return next(createError('Comment not found', 404));
    }
    // res.redirect('/admin/comments');
       res.json({ success: true, status: comment.status });
  } catch (error) {
    next(createError('Error updating comment status', 500));
  }
  
};

const deleteComments = async (req,res,next) => { 
  try {
    const comment = await commentsModel.findByIdAndDelete(req.params.id);
    if(!comment){
      return next(createError('Comment not found', 404));
    }
    // res.json({ success: true });
       res.json({ success: true });
  } catch (error) {
    next(createError('Error deleting comment', 500));
  }
};
  

const addCommentsPage = async (req, res) => {
    res.render('admin/add-comment'); 
};

const addComments = async (req, res) => {
    // Logic to add a comment goes here
    res.redirect('/admin/comments');
};

// Render update comment page
const updateCommentsPage = async (req, res) => {
    res.render('admin/update-comment'); 
};

const updateComments = async (req, res) => {
    // Logic to update comment
    res.redirect('/admin/comments');
};

module.exports = {
    allComments,
    addCommentsPage,
    addComments,
    updateCommentsPage,
    updateComments,           
    updateCommentStatus,     
    deleteComments
};
