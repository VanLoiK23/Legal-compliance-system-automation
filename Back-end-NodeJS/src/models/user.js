const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    company: String,
    birthDate: Date,
    role: {
        type: String,
        default: "user"
     }
}, {
    timestamps: true
});

const User = mongoose.model('user', userSchema);

module.exports = User;