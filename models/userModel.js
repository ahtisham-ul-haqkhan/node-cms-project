const mongoose = require('mongoose');
const bcrypt = require('bcrypts')

const userSchema = new mongoose.Schema({ 
    fullname: { 
        type: String, 
        required: true 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['author', 'admin'], 
        default: 'author'
    }
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});


const User = mongoose.model("User", userSchema);

module.exports = User;
