const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { bcrypt } = require('../helpers')

const userSchema = new Schema ({
    name: {
        type: String,
        required: [true, 'Please input your name']
    },
    email: {
        type: String,
        validate: [
            {
                validator: function(v) {
                    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v)
                },
                message: 'Invalid Email'
            },
            {
                validator: function(v) {
                    return mongoose.model('Users', userSchema).find({
                        _id: {
                            $ne: this._id
                        },
                        email: v
                    })
                    .then(data => {
                        if(data.length !== 0) {
                            return false
                        }
                    })
                    .catch(err => {
                        return err.message
                    })
                },
                message: 'Email has been used'
            }
        ]
    },
    password: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/.test(v)
            },
            message: 'Password must contain at least one letter, one number, and minimum six characters'
        }
    },
    profilePicture: String,
    role: String
}, {
    timestamps: {}
})


userSchema.pre('save', function(next) {
    this.email = this.email.toLowerCase()
    this.password = bcrypt.hashPassword(this.password)
    next()
})

userSchema.post('findOneAndUpdate', function(user, next) {
    user.email = user.email.toLowerCase()
    user.password = user.password
    
    return user.save({ runValidators: true})
})

const User = mongoose.model('User', userSchema)

module.exports = User