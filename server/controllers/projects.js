const { Project } = require('../models')

class projectController {
    static getAllProject (req, res) {
        Project.find({
            members: req.user.id
        })
        .populate('members')
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static getProjectById (req, res) {
        Project.findOne({
            _id: req.params.id
        })
        .populate('members')
        .then(project => {
            if(project) {
                res.status(200).json(project)
            } else {
                res.status(404).json({
                    message: 'Project not found'
                })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static createProject (req, res) {
        Project.findOne({
            name: req.body.name
        })
        .then(project => {
            if(!project) {
                Project.create({
                    ...req.body
                })
                .then(project => {
                    res.status(201).json(project)
                })
                .catch(err => {
                    if(err.errors.name) {
                        res.status(400).json({
                            message: err.errors.name.message
                        })
                    } else {
                        res.status(500).json(err)
                    }
                })
            } else {
                res.status(400).json({
                    message: 'Project already registered'
                })
            }
        })
        .catch(err => {

        })
    }

    static updateProject (req, res) {
        Project.findOneAndUpdate({
            _id: req.params.id
        }, {
            name: req.body.name
        }, {
            new: true
        })
        .then(project => {
            if(project) {
                res.status(200).json(project)
            } else {
                res.status(404).json({
                    message: 'Project not found'
                })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static addProjectMember (req, res) {
        Project.findOne({
            _id: req.params.id
        })
        .then(project => {
            let isRegistered = project.members.some(function (member) {
                return member.equals(req.body.id)
            })
            
            if(!isRegistered) {
                Project.findByIdAndUpdate({
                        _id: req.params.id
                    }, {
                        $push: {
                            members: req.body.id
                        }
                    }, {
                        new: true
                    })
                    .then(project => {
                        if(project) {
                            res.status(200).json(project)
                        } else {
                            res.status(404).json({
                                message: 'Project not found'
                            })
                        }
                    })
                    .catch(err => {
                        res.status(500).json(err)
                    })
            } else {
                res.status(400).json({
                    message: 'Member already registered'
                })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static deleteProjectMember (req, res) {
        Project.findByIdAndUpdate({
            _id: req.params.id
        }, {
            $pull: {
                members: req.body.id
            }
        }, {
            new: true
        })
        .then(project => {
            if(project) {
                res.status(200).json(project)
            } else {
                res.status(404).json({
                    message: 'Project not found'
                })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static deleteProject (req, res) {
        Project.findOneAndDelete({
            _id: req.params.id
        })
        .then(project => {
            if(project) {
                res.status(200).json({
                    message: 'Project successfully deleted'
                })
            } else {
                res.status(404).json({
                    message: 'Project not found'
                })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }
}

module.exports = projectController