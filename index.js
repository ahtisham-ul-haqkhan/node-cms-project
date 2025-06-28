const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
// const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const isLogin = require('./middleware/isLogin.js');
const app = express()
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(expressLayouts);
app.set('layout', 'layout')

app.set('view engine', 'ejs');

const MongoURL = process.env.MONGOURL;
const PORT = process.env.PORT || 4000;

mongoose.connect(MongoURL).then(() => {
    console.log("DB Connected")
})

  //Frontend Routes
app.use('/', require('./routes/frontend.js'))

// app.use(isLogin);

app.use((req, res, next) => {
  res.locals.role = req.role;
  res.locals.fullname = req.fullname;
  next();
});

app.use('/admin', (req,res,next) => {
  res.locals.layout = 'admin/layout';
  next();
})
app.use('/admin', require('./routes/admin.js'))

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
