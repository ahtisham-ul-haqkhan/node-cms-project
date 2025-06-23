const commentsModel = require('../models/commentModel');


const allComments = async (req, res) => {
    res.render('admin/comments');
};
const addCommentsPage = async (req, res) => {};
const addComments = async (req, res) => {};
const updateCommentsPage = async (req, res) => {};
const updateComments = async (req, res) => {};
const deleteComments = async (req, res) => {};

module.exports = {
    allComments,
    addCommentsPage,
    addComments,
    updateCommentsPage,
    updateComments,
    deleteComments
};