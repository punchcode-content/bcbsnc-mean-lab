const mongoose = require('mongoose');

const Todo = mongoose.model('Todo', {
  descr: String,
  done: Boolean
});

module.exports = Todo;