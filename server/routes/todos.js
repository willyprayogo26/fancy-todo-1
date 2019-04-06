const router = require('express').Router()
const { todoController } = require('../controllers')
const { isAuthorizedUser } = require('../middlewares')

router.get('/project/:projectId', todoController.getProjectTodo)

router.get('/:id', isAuthorizedUser, todoController.getAllTodo)
router.get('/:id/:todoId', isAuthorizedUser, todoController.getTodoById)
router.post('/:id', isAuthorizedUser, todoController.createTodo)
router.put('/:id/:todoId', isAuthorizedUser, todoController.updateTodo)
router.delete('/:id/:todoId', isAuthorizedUser, todoController.deleteTodo)

module.exports = router