import express from 'express'

import authMiddleware from '../middlewares/auth'
import Project from '../models/project'
import Task from '../models/task'

const router = express.Router()

router.use(authMiddleware) // só deixa passar com o token válido

router.get('/', async (req, res) => {
  try {

    const projects = await Project.find().populate('user')
    return res.send({ projects })

  } catch (err) {
    return res.status(400).send({ error: "Error listing projects" })
  }
})

router.get('/:_id', async (req, res) => {
  try {

    const { _id } = req.params

    const project = await Project.findById(req.params._id).populate('user')

    if(!project) return res.status(400).send({ error: "Not found project" })

    return res.send(project)

  } catch (err) {
    return res.status(400).send(err)
  }

})

router.post('/', async (req, res) => {

  try {
    const project = await Project.create({ ...req.body, user: req.userId })

    return res.send({ project })
  } catch (error) {
    return res.status(400).send({ error })
  }

})

router.put('/:_id', async (req, res) => {
  res.send({ user: req.userId })
})

router.delete('/:_id', async (req, res) => {
  try {

    await Project.findByIdAndRemove(req.params._id)

    return res.send()
  } catch (err) {
    return res.status(400).send({ error: "Error deleting project" })
  }
})

module.exports = app => app.use('/projects', router)