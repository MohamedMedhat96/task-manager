const express = require('express')
const router = new express.Router()
const Task = require('../models/task')

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.send(task)
    }
    catch (err) {
        res.status(400).send(err)
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.send(tasks)
    } catch (err) {
        res.status(400).send(err)

    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        if (!task)
            res.status(404).send
        res.send(task)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.patch('/tasks/:id', async (req, res) => {
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
        const task = await Task.findById(req.params.id)
        fields.forEach((field) => {
            task[field] = req.body[field]
        })
        await task.save()
        if (!task)
            return res.status(404).send("Task not found")
        res.send(task)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task)
            return res.status(404).send('Task not found')
        res.send(task)
    } catch (err) {
        res.send(500).send(err)
    }
})

module.exports = router