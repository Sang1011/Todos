const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
