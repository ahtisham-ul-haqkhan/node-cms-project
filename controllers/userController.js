const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config();

const loginPage = async(req,res) => {
    res.render('admin/login', {
        layout: false
    });
}
const adminLogin = async(req,res) => {
    try {
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
    res.render('admin/dashboard');
}

const settings = async(req,res) => {
    res.render('admin/settings');
}
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
    res.render('admin/users/create');
}
const addUser = async(req,res) => {
    try {
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
const updateUserPage = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findById(id); 
        res.render('admin/users/update', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send('User not found');
    }
};


const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
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
  
  const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await userModel.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).send("User Not Found");
      }
  
      res.redirect('/admin/users');
    } catch (error) {
      console.error("Delete User Error:", error);
      res.status(500).send("Something went wrong");
    }
  };
  



module.exports = {
    loginPage,
    adminLogin,
    Logout,
    dashboard,
    settings,
    allUser,
    addUserPage,
    addUser,
    updateUserPage,
    updateUser,
    deleteUser
};
