// requires
const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const apiRoutes = require('./routes/api');
const Todo = require('./models/todo');

// Declarations
const app = express();

// Express setup
mongoose.connect("mongodb://localhost:27017/todolist");

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());

// Routes
app.use('/api', apiRoutes);

app.get('/', function(req, res) {
    res.sendfile('./static/index.html');
});

app.listen(3000, function () {
    console.log('Express running on http://localhost:3000/.')
});
