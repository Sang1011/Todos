const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const database = require("./config/database");


// Routes
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.post('/todos', async (req, res) => {
    try {
        const newTodo = new Todo({
            content: req.body.content
        });
        await newTodo.save();
        res.json(newTodo);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.send('Todo deleted');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
