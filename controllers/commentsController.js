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


const updateCommentStatus = async (req, res) => {
    res.render('admin/comments');
};

const deleteComments = async (req, res) => {
    res.render('admin/comments');
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
