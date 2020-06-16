const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')
router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.send(task)
    }
    catch (err) {
        res.status(400).send(err)
    }
})

router.get('/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id })
        res.send(tasks)
    } catch (err) {
        res.status(400).send(err)

    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task)
            return res.status(404).send()
        return res.send(task)
    } catch (err) {
        return res.status(400).send(err)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const fields = Object.keys(req.body)
    const updateAbleFields = ["description", "completed"]
    const erroFields = []
    const isValidUpdate = fields.every((field) => {
        erroFields.push(field)
        return updateAbleFields.includes(field)
    })
    if (!isValidUpdate)
        return res.status(400).send("The fields you sent are not updatable" + "" + fields)
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task)
            return res.status(404).send("Task not found")

        fields.forEach((field) => {
            task[field] = req.body[field]
        })
        await task.save()

        return res.send(task)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task)
            return res.status(404).send('Task not found')
        res.send(task)
    } catch (err) {
        res.send(500).send(err)
    }
})

module.exports = router