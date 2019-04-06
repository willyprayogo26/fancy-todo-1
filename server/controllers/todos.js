const { Todo } = require('../models')

class todoController {
    static getAllTodo (req, res) {
        Todo.find({
            projectId: null,
            userId: req.params.id
        })
        .populate('projectId')
        .then(todos => {
            res.status(200).json(todos)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static getProjectTodo (req, res) {
        Todo.find({
            projectId: req.params.projectId
        })
        .populate({
            path: 'projectId',
            populate: {
                path: 'members'
            }
        })
        .then(todos => {
            res.status(200).json(todos)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static getTodoById (req, res) {
        Todo.findOne({
            _id: req.params.todoId
        })
        .then(todo => {
            res.status(200).json(todo)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static createTodo (req, res) {
        Todo.create({
            ...req.body
        })
        .then(todo => {
            res.status(201).json(todo)
        })
        .catch(err => {
            if(err.errors.name) {
                res.status(400).json({
                    message: err.errors.name.message
                })
            } else if(err.errors.description) {
                res.status(400).json({
                    message: err.errors.description.message
                })
            } else {
                res.status(500).json(err)
            }
        })
    }

    static updateTodo (req, res) {
        Todo.findOneAndUpdate({
            _id: req.params.todoId
        }, {
            ...req.body
        }, {
            new: true
        })
        .then(todo => {
            if(todo) {
                res.status(200).json(todo)
            } else {
                res.status(404).json({
                    message: 'Todo not found'
                })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static deleteTodo (req, res) {
        Todo.findOneAndDelete({
            _id: req.params.todoId
        })
        .then(todo => {
            if(todo) {
                res.status(200).json({
                    message: 'Todo successfully deleted'
                })
            } else {
                res.status(404).json({
                    message: 'Todo not found'
                })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }
}

module.exports = todoController