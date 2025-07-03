// middleware/validation.js
const { body } = require("express-validator")
const path = require('path');

const loginValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must contain no spaces')
        .isLength({ min: 4, max: 10 }).withMessage('Username must be 4–10 characters'),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Password must contain no spaces')
        .isLength({ min: 3, max: 10 }).withMessage('Password must be 5–10 characters'),
]

const userValidation = [
    body('fullname')
    .trim()
    .notEmpty().withMessage('Full Name is Require')
    .isLength({ min: 4, max: 20 }).withMessage('Full Name  must be 4–10 characters'),

    body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must contain no spaces')
    .isLength({ min: 4, max: 10 }).withMessage('Username must be 5–10 characters'),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Password must contain no spaces')
        .isLength({ min: 3, max: 10 }).withMessage('Password must be 5–10 characters'),
        

        body('role')
        .trim()
        .notEmpty().withMessage('role is required')
        .isIn(['author', 'admin']).withMessage('Role Must be AUthor Or Admin'),
        
]

const userUpdateValidation = [

    body('fullname')
    .trim()
    .notEmpty().withMessage('Full Name is Require')
    .isLength({ min: 5, max: 20 }).withMessage('Full Name  must be 5–10 characters'),


    body('password')
        .optional({ checkFalsy: true})
        // .matches(/^[a-zA-Z0-9_]+$/).withMessage('Password must contain no spaces')
        .isLength({ min: 3, max: 100 }).withMessage('Password must be 5–10 characters'),
        

        body('role')
        .trim()
        .notEmpty().withMessage('role is required')
        .isIn(['author', 'admin']).withMessage('Role Must be AUthor Or Admin'),

]


const categoryValidation = [

    body('name')
    .trim()
    .notEmpty().withMessage('Category Name is Require')
    .isLength({ min: 3, max: 12 }).withMessage('Category Name  must be 3-12 characters'),
    
    body('description')
    .isLength({  max: 120 }).withMessage('Category Name  must be at most 120 characters long'),

]

const categoryUpdateValidation = []

const articleValidation = [

    body('title')
    .trim()
    .notEmpty().withMessage('Title is Required')
    .isLength({ min: 7, max: 50 }).withMessage('Title must be 7-50 characters long'),

    body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 5, max: 1500 }).withMessage('Title must be 50-1500 characters long'),

    body('category')
    .trim()
    .notEmpty().withMessage('Category Is Required'),

    // body('image')
    // .custom((value, {req}) => {
    // if(!req.file) {
    //     throw new Error('Image is Required');
    // }
    // const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    // const fileExtension = path.extname(req.file.originalname).toLowerCase();
    // if(!allowedExtensions.includes(fileExtension)) {
    //     throw new Error('Invalid Image Format. Only jsp,jpeg, and png are allowed');
    // }
    // return true;
    // })
]

const articleUpdateValidation = []

module.exports = {
    loginValidation,
    userValidation,
    userUpdateValidation,
    categoryValidation,
    categoryUpdateValidation,
    articleValidation,
    articleUpdateValidation
}
