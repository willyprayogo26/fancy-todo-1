const router = require('express').Router()
const { projectController } = require('../controllers')
const { isAuthorizedProject, isAuthorizedUser } = require('../middlewares')

router.get('/', projectController.getAllProject)

router.post('/:id', isAuthorizedUser, projectController.createProject)

router.get('/:id', isAuthorizedProject, projectController.getProjectById)
router.put('/:id', isAuthorizedProject, projectController.updateProject)
router.patch('/add-member/:id', isAuthorizedProject, projectController.addProjectMember)
router.patch('/delete-member/:id', isAuthorizedProject, projectController.deleteProjectMember)
router.delete('/:id', isAuthorizedProject, projectController.deleteProject)

module.exports = router