const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Garante que o email seja único
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    phone: {
        type: Number,
        required: true,
    },
   
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
