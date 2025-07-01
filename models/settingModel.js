const mongoose = require('mongoose');


const settingSchema = new mongoose.Schema({
    website_name: {
        type: String,
        required: true
    },
    website_logo: {
        type: String,
    },
    footer_description: {
        type: String,
        required: true,
    }

});

const settingModel = mongoose.model('Setting', settingSchema);;
module.exports = settingModel;