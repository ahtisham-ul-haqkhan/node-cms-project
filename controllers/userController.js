const userModel = require('../models/userModel');
const newsModel = require('../models/newsModel');
const categoryModel = require('../models/categoryModel');
const settingModel = require("../models/settingModel")
const createError = require('../utils/error-message')
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config();

const loginPage = async(req,res) => {
    res.render('admin/login', {
        layout: false,
        errors: 0
    });
}
const adminLogin = async(req,res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            return  res.render('admin/login', {
                layout: false,
                errors: errors.array()
            });
        }
        const {username, password} = req.body;
        const user = await userModel.findOne({username});
        if(!user) {
            return res.status(201).send("User Not Found")
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(201).send("Credentials Not MAtch")
        }

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JwtToken, {expiresIn: '2h' });
        res.cookie('token', token, {httpOnly: true, maxAge: 60*60*1000 });
        res.redirect('/admin/users');
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
        
    }
}
const Logout = async(req,res) => {
    res.clearCookie('token');
    res.redirect('/admin');
}

const dashboard = async(req,res) => {
    try {
        let articleCount;
        if(req.role == 'admin') {
            const articleCount = await newsModel.countDocuments();
        } else {
            articleCount = await newsModel.countDocuments({author: req.id});
        }
        const categoryCount = await categoryModel.countDocuments();
        const userCount = await userModel.countDocuments();
        res.render('admin/dashboard', {fullname: req.fullname, articleCount, categoryCount, userCount});
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

const settings = async(req,res) => {
    try {
        const setting = await settingModel.findOne();
    res.render('admin/settings', {setting});
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}


const saveSettings = async (req, res) => {
    try {
        const { website_name, footer_description } = req.body;
        const website_logo = req.file ? req.file.filename : undefined;

        const updateFields = {
            website_name,
            footer_description,
        };

        if (website_logo) {
            updateFields.website_logo = website_logo;
        }

        const setting = await settingModel.findOneAndUpdate(
            {}, 
            updateFields,
            { new: true, upsert: true } 
        );

        res.redirect('/admin/settings');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
const allUser = async (req, res) => {
    try {
        const users = await userModel.find().lean(); 
        res.render('admin/users', { users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong!');
    }
};

const addUserPage = async(req,res) => {
    res.render('admin/users/create', {errors: 0});
}
const addUser = async(req,res, next) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return  res.render('admin/users/create', {
                errors: errors.array()
            });
        }
        const {fullname, username, password, role} = req.body;
        await userModel.create({
            fullname,
            username,
            password,
            role,
        })
        res.redirect('/admin/users'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
const updateUserPage = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await userModel.findById(id); 
  
      if (!user) {
        return next(createError('User Not Found', 404));
      }
  
      res.render('admin/users/update', {
        user,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  };
  
  // POST Update User Handler
  const updateUser = async (req, res) => {
    try {
      const errors = validationResult(req);
      const { id } = req.params;
  
      if (!errors.isEmpty()) {
        // Get existing user again to keep _id available in form
        const existingUser = await userModel.findById(id);
        return res.render('admin/users/update', {
          user: { ...req.body, _id: existingUser._id, username: existingUser.username },
          errors: errors.array()
        });
      }
  
      const { fullname, password, role } = req.body;
  
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      user.fullname = fullname || user.fullname;
      user.password = password || user.password;
      user.role = role || user.role;
  
      await user.save();
  
      res.redirect('/admin/users');
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  };
  
  const deleteUser = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).send("User Not Found");
      }

    const article = await newsModel.findOne({author: id})
        if(article) {
            return res.status(400).json({success: false, message: 'Author is assigned to news articles and cannot be deleted.'});
            // return next(createError("Category has news", 400));
        }
      await categoryModel.deleteent({ _id:id });
  
      res.redirect('/admin/users');
    } catch (error) {
        error(next);
    }
  };
  



module.exports = {
    loginPage,
    adminLogin,
    Logout,
    dashboard,
    settings,
    saveSettings,
    allUser,
    addUserPage,
    addUser,
    updateUserPage,
    updateUser,
    deleteUser
};
