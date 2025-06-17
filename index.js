const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const flash = require('connect-flash')

const app = express()
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressLayouts);
app.set('layout', 'layout')

app.set('view engine', 'ejs');

const MongoURL = process.env.MONGOURL;
const PORT = process.env.PORT || 4000;

mongoose.connect(MongoURL).then(() => {
    console.log("DB Connected")
})

app.get('/', (req, res) => {
  res.send('Hello Worlsd!')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
