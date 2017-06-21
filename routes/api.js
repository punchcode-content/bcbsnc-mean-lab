const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

const jsonSuccess = function (res, data) {
    return res.json({
        "status": "success",
        "data": data
    })
}

const jsonError = function (res, err) {
    return res.status(501).json({
        "status": "err",
        "message": err
    })
}

router.get('/todos', function (req, res) {
    Todo.find({}, null, {sort: {done: 1, _id: -1}}, function (err, todos) {
        if (err) return jsonError(res, err);

        jsonSuccess(res, {
            todos: todos
        });
    });
});

router.post('/todos', function (req, res) {
    const todo = new Todo({
        descr: req.body.descr,
        done: false
    });
    todo.save(function (err) {
        if (err) return jsonError(res, err);

        jsonSuccess(res, {
            todo: todo
        }).status(201);
    })
});

router.delete('/todos', function (req, res) {
    if (req.query['cleanup']) {
        Todo.deleteMany({done: true}, function (err) {
            if (err) return jsonError(res, err);

            jsonSuccess(res, {
                deleted: true
            });
        })
    } else {
        res.status(400).json({
            "status": "fail"
        });
    }
});

router.get('/todos/:id', function (req, res) {
    Todo.findById(req.params.id, function (err, todo) {
        if (err) return jsonError(res, err);

        if (todo) {
            jsonSuccess(res, {
                todo: todo
            });
        } else {
            res.status(404).json({
                "status": "fail",
                "data": {
                    "id": "There is no todo with that ID."
                }
            });
        }
    });
});

router.put('/todos/:id', function (req, res) {
    const updateObject = {};
    if (req.body.hasOwnProperty('descr')) updateObject.descr = req.body.descr;
    if (req.body.hasOwnProperty('done')) updateObject.done = req.body.done;

    Todo.findByIdAndUpdate(req.params.id, updateObject, {new: true}, function (err, todo) {
        if (err) return jsonError(res, err);
        
        if (todo) {
            jsonSuccess(res, {
                updated: true,
                todo: todo
            });
        } else {
            res.status(404).json({
                "status": "fail",
                "data": {
                    "id": "There is no todo with that ID."
                }
            });
        }
    })
});

router.delete('/todos/:id', function (req, res) {
    Todo.findByIdAndRemove(req.params.id, function (err, todo) {
        if (err) return jsonError(res, err);

        jsonSuccess(res, {
            deleted: true
        });
    });
});

module.exports = router;
