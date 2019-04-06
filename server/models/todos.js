const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema ({
    name: {
        type: String,
        required: [true, 'Please input your todo']
    },
    description: {
        type: String,
        required: [true, 'Please input description']
    },
    status: String,
    due_date: Date,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }
}, {
    timestamps: {}
})

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo