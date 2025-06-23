const userModel = require('../models/userModel');

const loginPage = async(req,res) => {
    res.render('admin/login', {
        layout: false
    });
}
const adminLogin = async(req,res) => {}
const Logout = async(req,res) => {}

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


const updateUser = async(req,res) => {}
const deleteUser = async(req,res) => {}



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
