const express = require('express')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendDeleteEmail } = require('../emails/account')
const image = multer({
    limits: {
        fileSize: 1000000
    }, fileFilter(req, file, cb) {
        //cb(undefined, true)
        if (!file.originalname.match("\.(png|jpg|jpeg)"))
            return cb(new Error("File not supported, file should be an Image file"))
        cb(undefined, true)
    }
})

router.post('/me/avatar', auth, image.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).png().resize({ width: 250, height: 250 }).toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error("The user or the avatar are not found")
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.post('', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get('/me', auth, async (req, res) => {
    res.send(req.user)
})


router.delete('/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendDeleteEmail(req.user.email, req.user.name)
        return res.send(req.user)
    } catch (err) {
        return res.status(500).send(err)
    }
})
router.patch('/me', auth, async (req, res) => {
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


router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        return res.send({ user, token })
    } catch (err) {
        return res.status(400).send({ message: err.message })
    }
})


router.post('/logout', auth, async (req, res) => {
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

router.post('/logoutFromAllSessions', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})
module.exports = router