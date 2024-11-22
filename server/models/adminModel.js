const mongoose = require('mongoose');
const { type } = require('os');

const adminShema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true 
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },
    createdAt: {
        type: Date, 
        default: Date.now
    },
    role: {
        type: String,
        default: 'admin' 
    },

});

const Admin = mongoose.model('Admin', adminShema);

module.exports = Admin;