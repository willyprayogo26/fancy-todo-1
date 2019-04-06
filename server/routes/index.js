const router = require('express').Router()
const projects = require('./projects')
const users = require('./users')
const todos = require('./todos')
const { isLogin } = require('../middlewares')
const { userController } = require('../controllers')

router.post('/registerAdmin', userController.registerAdmin)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/google-login', userController.googleLogin)

router.use(isLogin)
router.use('/projects', projects)
router.use('/users', users)
router.use('/todos', todos)

module.exports = router