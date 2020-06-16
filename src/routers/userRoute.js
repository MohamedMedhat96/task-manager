const express = require('express')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()

        return res.send(req.user)
    } catch (err) {
        return res.send(500).send(err)
    }
})
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password", "age"]
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate)
        return res.status(400).send("The fields you entered are not updateable")
    try {
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (err) {
        res.status(400).send(err)
    }
})


router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        return res.send({ user, token })
    } catch (err) {
        return res.status(400).send({ message: err.message })
    }
})


router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        return res.send()
    }
    catch (e) {
        return res.status(500).send(e)
    }
})

router.post('/users/logoutFromAllSessions', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})
module.exports = router